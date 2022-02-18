import { IAccount } from '../interfaces/account.interface';
import { Account } from '../database/entities/account.entity';
import { Repository } from 'typeorm';
import { Generator } from '../helpers/generator';

export class AccountService {

  constructor(private readonly accountRepository: Repository<Account>) { }

  async findOne(accountNumber: string): Promise<IAccount> {
    const account = await this.accountRepository.findOne({ accountNumber });
    if (!account) {
      throw new Error("Invalid account number");
    }
    return account;
  }

  async createAccount(account: IAccount): Promise<IAccount> {
    const { name } = account;
    if (!name) {
      throw new Error("Name is required");
    }
    const newAccount = {
      name,
      accountNumber: Generator.generateAccountNumber(),
    } as IAccount;
    return await this.accountRepository.save(newAccount);
  }

  async fundAccount(accountNumber: string, amount: number): Promise<IAccount> {
    if (amount <= 0) {
      throw new Error("Invalid fund amount");
    }
    const account = await this.accountRepository.findOne({ accountNumber });
    if (!account) {
      throw new Error("Invalid Account number");
    }

    account.balance += amount;
    return await this.accountRepository.save(account);
  }

  async transferToAnother(sourceAccountNo: string, destinationAccountNo: string, amount: number): Promise<IAccount> {
    if (amount <= 0) {
      throw new Error("Invalid fund amount");
    }
    if (sourceAccountNo == destinationAccountNo) {
      throw new Error("Source account number can not be the same as destination account number");
    }
    const sourceAccount = await this.accountRepository.findOne({ accountNumber: sourceAccountNo });
    const destAccount = await this.accountRepository.findOne({ accountNumber: destinationAccountNo });
    if (!sourceAccount) {
      throw new Error("Invalid Source Account number");
    }
    if (!destAccount) {
      throw new Error("Invalid Destination Account number");
    }
    if (sourceAccount.balance < amount) {
      throw new Error("Insufficient funds");
    }
    sourceAccount.balance -= amount;
    destAccount.balance += amount;

    await this.accountRepository.save(destAccount);
    return await this.accountRepository.save(sourceAccount);
  }

  async withdraw(accountNumber: string, amount: number): Promise<IAccount> {
    if (amount <= 0) {
      throw new Error("Invalid fund amount");
    }
    const account = await this.accountRepository.findOne({ accountNumber });

    if (!account) {
      throw new Error("Invalid Account number");
    }
    if (account.balance < amount) {
      throw new Error("Insufficient funds");
    }

    account.balance -= amount;

    return await this.accountRepository.save(account);
  }

}