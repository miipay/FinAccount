import { Body, Controller, Get, Header, HttpCode, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { AccessTokenGuard } from '@src/shared/guards/accessToken.guard';
import { PermissionsGuard } from '@src/shared/guards/permission.guard';
import { Permissions } from '@src/shared/decorators/permission.decorator';
import { Account, DepositWithdrawLedger, TransferLedger } from './entities';
import { CreateAccountDto, UpdateEnabledDto, UpdateNameDto, DepositWithdrawDto } from './account.dto';
import { AccountsService } from './account.service';
import { PERMISSIONS } from './constants';

@Controller('accounts')
@UseGuards(AccessTokenGuard, PermissionsGuard)
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get()
  @Header('Cache-Control', 'none')
  @Permissions(PERMISSIONS.AccountListAll)
  async findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Account>> {
    return this.accountsService.findAll(query);
  }

  @Post()
  @Header('Cache-Control', 'none')
  @HttpCode(201)
  @Permissions(PERMISSIONS.AccountCreate)
  async create(@Body() account: CreateAccountDto): Promise<Account> {
    return this.accountsService.create(account);
  }

  @Put('/:id/name')
  @Header('Cache-Control', 'none')
  @Permissions(PERMISSIONS.AccountUpdate)
  async updateName(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNameDto): Promise<Account> {
    return this.accountsService.rename(id, dto.name);
  }

  @Put('/:id/enabled')
  @Header('Cache-Control', 'none')
  @Permissions(PERMISSIONS.AccountEnable)
  async updateEnabled(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEnabledDto): Promise<Account> {
    return this.accountsService.enable(id, dto.enabled);
  }

  @Put('/:id/deposit')
  @Header('Cache-Control', 'none')
  @Permissions(PERMISSIONS.AccountWithdrawDeposit)
  async deposit(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DepositWithdrawDto,
  ): Promise<DepositWithdrawLedger> {
    return this.accountsService.deposit(id, dto.amount, dto.note);
  }

  @Put('/:id/withdraw')
  @Header('Cache-Control', 'none')
  @Permissions(PERMISSIONS.AccountWithdrawDeposit)
  async withdraw(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DepositWithdrawDto,
  ): Promise<DepositWithdrawLedger> {
    return this.accountsService.withdraw(id, dto.amount, dto.note);
  }

  @Put('/:fromId/transfer/:toId')
  @Header('Cache-Control', 'none')
  @Permissions(PERMISSIONS.AccountTransfer)
  async transfer(
    @Param('fromId', ParseIntPipe) fromId: number,
    @Param('toId', ParseIntPipe) toId: number,
    @Body() dto: DepositWithdrawDto,
  ): Promise<TransferLedger> {
    return this.accountsService.transfer(fromId, toId, dto.amount, dto.note);
  }

  @Get('/:id')
  @Header('Cache-Control', 'none')
  @Permissions(PERMISSIONS.AccountListAll)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Account> {
    return this.accountsService.findOne(id);
  }
}
