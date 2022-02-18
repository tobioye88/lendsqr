import * as express from "express";
import {Request, Response} from "express";
import { createConnection, getRepository, Repository } from 'typeorm';
import {Account} from './database/entities/account.entity'
import { AccountService } from './services/account.service';
import { IAccount, FundAccountRequest, TransferRequest, WithdrawAccountRequest } from './interfaces/account.interface';

// create and setup express app
const app = express();
app.use(express.json());

//typeOrmRepository
const connection = createConnection();


// register routes
app.get("/account/:accountNumber", async function(req: Request, res: Response) {
  const accountService = new AccountService(getRepository(Account));
  const { accountNumber } = req.params;
  try{
    const account = await accountService.findOne(accountNumber);
    res.status(200).json(account);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
  
});

app.post("/account", async function(req: Request, res: Response) {
  const accountService = new AccountService(getRepository(Account));
  const account = (req.body as IAccount);
  try{
    const createdAccount = await accountService.createAccount(account);
    res.status(201).json(createdAccount);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

app.patch("/account/fund", async function(req: Request, res: Response) {
  const accountService = new AccountService(getRepository(Account));
  const {accountNumber, amount} = (req.body as FundAccountRequest);
  try{
    const account = await accountService.fundAccount(accountNumber, amount);
    res.status(200).json(account);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

app.patch("/account/funds/transfer", async function(req: Request, res: Response) {
  const accountService = new AccountService(getRepository(Account));
  const {sourceAccountNumber, destinationAccountNumber, amount} = (req.body as TransferRequest);
  try{
    const account = await accountService.transferToAnother(sourceAccountNumber, destinationAccountNumber, amount);
    res.status(200).json(account);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

app.patch("/account/funds/withdraw", async function(req: Request, res: Response) {
  const accountService = new AccountService(getRepository(Account));
  const {accountNumber, amount} = (req.body as WithdrawAccountRequest);
  try{
    const account = await accountService.withdraw(accountNumber, amount);
    res.status(200).json(account);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});


//custom 404 response
app.use((req, res)=>{
    res.type('application/json');
    res.status(404);
    res.json({ message: '404 - Not Found' });
})

// custom 500 response
app.use(function(err, req, res, next){ 
    console.error(err.stack);
    res.type('application/json');
    res.status(500);
    res.json({ message: '500 - Server Error' });
});

// start express server
app.listen(3000, () => {
  console.log("Express Server Started");
});
