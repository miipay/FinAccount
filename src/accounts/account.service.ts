import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository, In } from 'typeorm';
import { FilterOperator, PaginateQuery, paginate, Paginated } from 'nestjs-paginate';
import Decimal from 'decimal.js';
import { Account, DepositWithdrawLedger, TransferLedger } from './entities';
import { createDepositWithdrawLedger, createTransferLedger } from './utils/ledgers';
import { withTransaction } from './utils/orm';
import { CreateAccountDto } from './account.dto';
import { DepositWithdraw, AccountServiceErrors } from './constants';

@Injectable()
export class AccountsService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async create(account: CreateAccountDto): Promise<Account> {
    const accountEntity = this.accountRepository.create(account);
    return this.accountRepository.save(accountEntity);
  }

  async rename(id: number, name: string): Promise<Account> {
    const accountEntity = await this.findOne(id);
    this.accountRepository.merge(accountEntity, { name });
    return this.accountRepository.save(accountEntity, { reload: true });
  }

  async enable(id: number, enabled = true): Promise<Account> {
    const accountEntity = await this.findOne(id);
    this.accountRepository.merge(accountEntity, { enabled });
    return this.accountRepository.save(accountEntity, { reload: true });
  }

  async deposit(id: number, amount: string, note?: string): Promise<DepositWithdrawLedger> {
    const depositAmount = new Decimal(amount);
    if (depositAmount.lessThanOrEqualTo(0)) {
      throw new BadRequestException(`Amount ${amount} must be greater than 0`, AccountServiceErrors.NEGATIVE_AMOUNT);
    }
    // check the existence of id.
    this.findOne(id);
    return withTransaction(this.dataSource, async (manager: EntityManager) => {
      // increase the balance
      const increment = await manager.increment<Account>(Account, { id, enabled: true }, 'balance', amount);
      if (increment.affected < 1) {
        throw new BadRequestException(`Unable to update balance of account ${id}`, AccountServiceErrors.UNABLE_TO_USE);
      }
      // prepare ledger
      return await createDepositWithdrawLedger(manager, id, depositAmount, DepositWithdraw.DEPOSIT, note);
    });
  }

  async withdraw(id: number, amount: string, note?: string): Promise<DepositWithdrawLedger> {
    const withdrawAmount = new Decimal(amount);
    if (withdrawAmount.lessThanOrEqualTo(0)) {
      throw new BadRequestException(`Amount ${amount} must be greater than 0`, AccountServiceErrors.NEGATIVE_AMOUNT);
    }
    // check the amount and existence of id.
    const account = await this.findOne(id);
    if (account.balance.lessThan(withdrawAmount)) {
      throw new BadRequestException(
        `Withdraw amount ${amount} must be less than balance`,
        AccountServiceErrors.INSUFFICIENT_FUND,
      );
    }
    return await withTransaction<DepositWithdrawLedger>(this.dataSource, async (manager: EntityManager) => {
      // update the balance only when the balance is greater than amount, no negative value allowed.
      const decrement = await manager
        .createQueryBuilder()
        .update(Account)
        .set({ balance: () => `balance - ${amount}` })
        .where('id = :id AND enabled = true AND balance >= :amount', {
          id,
          amount,
        })
        .execute();
      if (decrement.affected < 1) {
        throw new BadRequestException(`Unable to update balance of account ${id}`, AccountServiceErrors.UNABLE_TO_USE);
      }
      // prepare ledger
      return await createDepositWithdrawLedger(manager, id, withdrawAmount, DepositWithdraw.WITHDRAW, note);
    });
  }

  async transfer(fromId: number, toId: number, amount: string, note?: string): Promise<TransferLedger> {
    const transferAmount = new Decimal(amount);
    if (transferAmount.lessThanOrEqualTo(0)) {
      throw new BadRequestException(`Amount ${amount} must be greater than 0`, AccountServiceErrors.NEGATIVE_AMOUNT);
    }
    const accounts = await this.accountRepository.findBy({ id: In([fromId, toId]) });
    if (accounts.length !== 2) {
      const inexisted = [fromId, toId].filter((id) => !accounts.find((account) => account.id === id));
      throw new BadRequestException(`Account(s) is/are inexisted ${inexisted}`, AccountServiceErrors.UNABLE_TO_USE);
    }
    const fromAccountEntity = accounts.find((account) => account.id === fromId);
    if (fromAccountEntity.balance.lessThan(transferAmount)) {
      throw new BadRequestException(
        `Transfer amount ${amount} must be less than balance`,
        AccountServiceErrors.INSUFFICIENT_FUND,
      );
    }
    return await withTransaction<TransferLedger>(this.dataSource, async (manager: EntityManager) => {
      // update the balance only when the balance is greater than amount, no negative value allowed.
      const decrement = await manager
        .createQueryBuilder()
        .update(Account)
        .set({ balance: () => `balance - ${amount}` })
        .where('id = :id AND enabled = true AND balance >= :amount', {
          id: fromId,
          amount,
        })
        .execute();
      if (decrement.affected < 1) {
        throw new BadRequestException(
          `Unable to update balance of account ${fromId}`,
          AccountServiceErrors.UNABLE_TO_USE,
        );
      }
      // increase the balance
      const increment = await manager.increment<Account>(Account, { id: toId, enabled: true }, 'balance', amount);
      if (increment.affected < 1) {
        throw new BadRequestException(
          `Unable to update balance of account ${toId}`,
          AccountServiceErrors.UNABLE_TO_USE,
        );
      }
      // prepare ledger
      return await createTransferLedger(manager, fromId, toId, transferAmount, note);
    });
  }

  findAll(query: PaginateQuery): Promise<Paginated<Account>> {
    return paginate(query, this.accountRepository, {
      sortableColumns: ['id', 'enabled'],
      defaultSortBy: [['id', 'DESC']],
      filterableColumns: {
        enabled: [FilterOperator.EQ],
        created: [FilterOperator.GT, FilterOperator.GTE, FilterOperator.LT, FilterOperator.LTE, FilterOperator.BTW],
      },
    });
  }

  findOne(id: number): Promise<Account> {
    return this.accountRepository.findOneByOrFail({ id });
  }
}
