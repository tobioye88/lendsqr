export interface IAccount {
  id?: number;
  accountNumber: string;
  name: string;
  balance: number;
  createdAt?: Date;
}

export interface FundAccountRequest {
  accountNumber: string;
  amount: number;
}

export interface TransferRequest {
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  amount: number;
}

export interface WithdrawAccountRequest {
  accountNumber: string;
  amount: number;
}