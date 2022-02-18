import { Account } from '../src/database/entities/account.entity';
import { AccountService } from '../src/services/account.service';
import { Repository, getCustomRepository } from 'typeorm';
import { IAccount } from '../src/interfaces/account.interface';
import { Generator } from '../src/helpers/generator';

jest.mock('../src/helpers/generator', () => ({
  Generator: {
    generateAccountNumber: jest.fn().mockImplementation(() => Math.round(Math.random() * 10000000000) + "")
  }
}))
describe('AccountService', () => {
  let accountsDB = [] as IAccount[];
  let accountRepository;
  let accountService: AccountService;

  beforeEach(async () => {
    accountRepository = {
      findOne: ({ accountNumber }) => {
        return accountsDB.find(account => account.accountNumber == accountNumber);
      },
      save: (account: IAccount) => {
        const index = accountsDB.map(account => account.accountNumber).indexOf(account.accountNumber);
        if (index == -1) {
          account.id = accountsDB.length + 1;
          account.balance = account.balance ? 0 : account.balance;
          accountsDB.push(account);
          return account;
        } else {
          accountsDB[index] = account;
          return account;
        }
      },
    };
    // console.log(accountRepository);
    accountService = new AccountService(accountRepository);
  });

  afterEach(() => {
    accountsDB = [];
  })

  //createAccount
  it('should throw and exception if name is not set', async () => {
    try {
      await accountService.createAccount({} as IAccount);
    } catch (e) {
      expect(e.message).toBe('Name is required');
    }
  });
  it('should create an account', async () => {
    const validAccount = { name: "john doe" } as IAccount;
    const createdAccount = await accountService.createAccount(validAccount);
    console.log('createdAccount', createdAccount);
    expect(validAccount.name).toBe(createdAccount.name);
    expect(createdAccount.accountNumber).toBeDefined()
    expect(createdAccount.id).toBeDefined()
  });

  //fundAccount
  it('should throw an exception if amount is less than 0', async () => {
    const testAccount = { name: 'john doe', accountNumber: '9854743932', id: 1, balance: 0 } as IAccount;
    accountsDB.push(testAccount);
    const accountNumber = '9854743932'
    try {
      await accountService.fundAccount(accountNumber, -2);
    } catch (e) {
      expect(e.message).toBe('Invalid fund amount');
    }
  });
  it('should throw an exception if account is not found', async () => {
    const testAccount = { name: 'john doe', accountNumber: '9854743932', id: 1, balance: 0 } as IAccount;
    accountsDB.push(testAccount);
    const accountNumber = '9854743933'
    try {
      const createdAccount = await accountService.fundAccount(accountNumber, 200);
    } catch (e) {
      expect(e.message).toBe('Invalid Account number');
    }
  });
  it('should add to account balance', async () => {
    const testAccount = { name: 'john doe', accountNumber: '9854743932', id: 1, balance: 0 } as IAccount;
    accountsDB.push(testAccount);
    const accountNumber = '9854743932'
    const createdAccount = await accountService.fundAccount(accountNumber, 200);
    expect(createdAccount.balance).toBe(200);
  });

  //transferToAnother
  it('should throw an exception if amount is less than 0', async () => {
    const sourceAccountNumber = '9854743932'
    const destinationAccountNo = '2854743932'
    try {
      await accountService.transferToAnother(sourceAccountNumber, destinationAccountNo, -200);
    } catch (e) {
      expect(e.message).toBe('Invalid fund amount');
    }
  });
  it('should throw an exception if source account number is the same as destination account number', async () => {
    const sourceAccountNumber = '9854743932'
    const destinationAccountNo = '9854743932'
    try {
      await accountService.transferToAnother(sourceAccountNumber, destinationAccountNo, 200);
    } catch (e) {
      expect(e.message).toBe('Source account number can not be the same as destination account number');
    }
  });
  it('should throw an exception if source account is not found', async () => {
    const sourceAccountNumber = '9854743932'
    const destinationAccountNo = '2854743932'
    try {
      await accountService.transferToAnother(sourceAccountNumber, destinationAccountNo, 200);
    } catch (e) {
      expect(e.message).toBe('Invalid Source Account number');
    }
  });
  it('should throw an exception if destination account is not found', async () => {
    const sourceAccount = { name: 'john doe', accountNumber: '9854743932', id: 1, balance: 0 } as IAccount;
    accountsDB.push(sourceAccount);
    const destinationAccountNo = '2854743932'
    try {
      await accountService.transferToAnother(sourceAccount.accountNumber, destinationAccountNo, 200);
    } catch (e) {
      expect(e.message).toBe('Invalid Destination Account number');
    }
  });
  it('should throw an exception if source account balance is less than transfer amount', async () => {
    const sourceAccount = { name: 'john doe', accountNumber: '9854743932', id: 1, balance: 0 } as IAccount;
    const destinationAccount = { name: 'john doe', accountNumber: '2854743932', id: 1, balance: 0 } as IAccount;
    accountsDB.push(sourceAccount, destinationAccount);
    try {
      await accountService.transferToAnother(sourceAccount.accountNumber, destinationAccount.accountNumber, 200);
    } catch (e) {
      expect(e.message).toBe('Insufficient funds');
    }
  });
  it('should transfer to destination account', async () => {
    const sourceAccount = { name: 'john doe', accountNumber: '9854743932', id: 1, balance: 500 } as IAccount;
    const destinationAccount = { name: 'john doe', accountNumber: '4854743932', id: 1, balance: 0 } as IAccount;
    accountsDB.push(sourceAccount, destinationAccount);
    const newSourceAccount = await accountService.transferToAnother(sourceAccount.accountNumber, destinationAccount.accountNumber, 200);
    const newDestinationAccount = await accountService.findOne(destinationAccount.accountNumber);
    expect(newSourceAccount.balance).toBe(300);
    expect(newDestinationAccount.balance).toBe(200)
  });

  //withdraw
  it('should throw an exception if amount is less than 0', async () => {
    const sourceAccount = { name: 'john doe', accountNumber: '9854743932', id: 1, balance: 0 } as IAccount;

    accountsDB.push(sourceAccount);
    try {
      await accountService.withdraw(sourceAccount.accountNumber, -200);
    } catch (e) {
      expect(e.message).toBe('Invalid fund amount');
    }
  });
  it('should throw an exception if account is not found', async () => {
    try {
      await accountService.withdraw('9854743932', 200);
    } catch (e) {
      expect(e.message).toBe('Invalid Account number');
    }
  });
  it('should throw an exception if account balance is less than transfer amount', async () => {
    const sourceAccount = { name: 'john doe', accountNumber: '9854743932', id: 1, balance: 0 } as IAccount;

    accountsDB.push(sourceAccount);
    try {
      await accountService.withdraw(sourceAccount.accountNumber, 200);
    } catch (e) {
      expect(e.message).toBe('Insufficient funds');
    }
  });
  it('should be able to withdraw amount', async () => {
    const sourceAccount = { name: 'john doe', accountNumber: '9854743932', id: 1, balance: 500000 } as IAccount;

    accountsDB.push(sourceAccount);
    const newAccount = await accountService.withdraw(sourceAccount.accountNumber, 200);
    expect(newAccount.balance).toBe(500000 - 200);
  });

});