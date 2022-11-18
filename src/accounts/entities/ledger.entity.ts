import { Entity, CreateDateColumn, Column, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Decimal from 'decimal.js';
import { DecimalTransformer } from '@src/shared/transformers/decimal.transformer';
import { DepositWithdraw } from '../constants';
import { Account } from './account.entity';

abstract class BaseLedger {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 20, scale: 8, default: 0.0, transformer: new DecimalTransformer() })
  amount: Decimal;

  @Column({ type: 'varchar', length: 256 })
  note: string;

  @CreateDateColumn()
  @Index()
  created: Date;
}

@Entity()
export class DepositWithdrawLedger extends BaseLedger {
  @Column({ type: 'enum', enum: DepositWithdraw, default: DepositWithdraw.DEPOSIT })
  type: DepositWithdraw;

  @ManyToOne(() => Account, { nullable: false, onDelete: 'RESTRICT', eager: true })
  @JoinColumn()
  account: Account;
}

@Entity()
export class TransferLedger extends BaseLedger {
  @ManyToOne(() => Account, { nullable: false, onDelete: 'RESTRICT', eager: true })
  @JoinColumn()
  fromAccount: Account;

  @ManyToOne(() => Account, { nullable: false, onDelete: 'RESTRICT', eager: true })
  @JoinColumn()
  toAccount: Account;
}
