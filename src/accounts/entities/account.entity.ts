import Decimal from 'decimal.js';
import { Entity, CreateDateColumn, Column, Index, PrimaryGeneratedColumn } from 'typeorm';
import { DecimalTransformer } from '../../shared/transformers/decimal.transformer';
import { CURRENCY_CODES, AccountType } from '../constants';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128 })
  name: string;

  @Column({ type: 'enum', enum: AccountType, default: AccountType.DEBIT })
  type: AccountType;

  @Column({ default: true })
  @Index()
  enabled: boolean;

  @Column({ type: 'enum', enum: CURRENCY_CODES })
  currency: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, default: 0.0, transformer: new DecimalTransformer() })
  balance: Decimal;

  @CreateDateColumn()
  @Index()
  created: Date;
}
