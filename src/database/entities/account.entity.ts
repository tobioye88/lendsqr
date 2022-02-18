import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from "typeorm";
import { IAccount } from '../../interfaces/account.interface';

@Entity("accounts")
export class Account implements IAccount {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "account_number" })
    accountNumber: string;

    @Column({ default: 0})
    balance: number;

    @Column()
    name: string;

    @CreateDateColumn()
    createdAt: Date;

}