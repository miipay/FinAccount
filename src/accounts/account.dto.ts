import { IsString, IsEnum, IsBoolean, IsOptional, IsNotEmpty, MaxLength, IsNumberString } from 'class-validator';
import { CURRENCY_CODES, AccountType } from './constants';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsEnum(AccountType)
  type: AccountType;
  @IsNotEmpty()
  @IsEnum(CURRENCY_CODES)
  currency: string;
  @IsBoolean()
  @IsOptional()
  enabled: boolean;
}

export class UpdateNameDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateEnabledDto {
  @IsNotEmpty()
  @IsBoolean()
  enabled: boolean;
}

export class DepositWithdrawDto {
  // don't convert to number, we will convert it at the service with decimal.js
  @IsNumberString()
  amount: string;
  @IsString()
  @IsOptional()
  @MaxLength(256)
  note: string;
}

export class TransferDto {
  // don't convert to number, we will convert it at the service with decimal.js
  @IsNumberString()
  amount: string;
  @IsString()
  @IsOptional()
  @MaxLength(256)
  note: string;
}
