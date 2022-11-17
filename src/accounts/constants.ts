import CurrencyList from 'currency-list';

export enum AccountType {
  DEBIT = 0,
  CREDIT,
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

export const PERMISSIONS = {
  AccountListOwned: { service: 'FinAccount', permission: 'account.listOwned' },
  AccountListAll: { service: 'FinAccount', permission: 'account.listAll' },
  AccountCreate: { service: 'FinAccount', permission: 'account.create' },
  AccountUpdate: { service: 'FinAccount', permission: 'account.update' },
  AccountDelete: { service: 'FinAccount', permission: 'account.delete' },
  AccountEnable: { service: 'FinAccount', permission: 'account.enable' },
  AccountWithdrawDeposit: { service: 'FinAccount', permission: 'account.withdrawDeposit' },
  AccountTransfer: { service: 'FinAccount', permission: 'account.transfer' },
  LedgerListOwned: { service: 'FinAccount', permission: 'ledger.listOwned' },
  LedgerListAll: { service: 'FinAccount', permission: 'ledger.listAll' },
};
