import { EntityManager } from 'typeorm';
import Decimal from 'decimal.js';
import { DepositWithdrawLedger, TransferLedger } from '../entities/ledger.entity';
import { DepositWithdraw } from '../constants';

export const createDepositWithdrawLedger = async (
  manager: EntityManager,
  accountId: number,
  amount: Decimal,
  type: DepositWithdraw,
  note?: string,
): Promise<DepositWithdrawLedger> => {
  const depositLedger = manager.create<DepositWithdrawLedger>(DepositWithdrawLedger, {
    account: { id: accountId },
    amount,
    type,
    note,
  });
  const retLedger = await manager.save(depositLedger, { reload: true });
  return await manager.findOneBy<DepositWithdrawLedger>(DepositWithdrawLedger, { id: retLedger.id });
};

export const createTransferLedger = async (
  manager: EntityManager,
  fromId: number,
  toId: number,
  amount: Decimal,
  note?: string,
): Promise<TransferLedger> => {
  const depositLedger = manager.create<TransferLedger>(TransferLedger, {
    fromAccount: { id: fromId },
    toAccount: { id: toId },
    amount,
    note,
  });
  const retLedger = await manager.save(depositLedger);
  return await manager.findOneBy<TransferLedger>(TransferLedger, { id: retLedger.id });
};
