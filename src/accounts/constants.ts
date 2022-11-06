import CurrencyList from 'currency-list';

export enum AccountType {
  DEFAULT = 0,
  RESERVE,
}

export enum DepositWithdraw {
  DEPOSIT = 0,
  WITHDRAW,
}

export const CURRENCY_CODES = Object.keys(CurrencyList.getAll('en_US'));

export enum AccountServiceErrors {
  NEGATIVE_AMOUNT = 'negative_amount',
  UNABLE_TO_USE = 'account_is_unable_to_use',
  INSUFFICIENT_FUND = 'insufficient_fund',
}
