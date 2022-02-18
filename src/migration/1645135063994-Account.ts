import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class Account1645135063994 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "accounts",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true
                },
                {
                    name: "name",
                    type: "varchar",
                },
                {
                    name: "account_number",
                    type: "varchar",
                },
                {
                    name: "balance",
                    type: "int",
                    default: 0,
                },
                {
                    name: "created_at",
                    type: "timestamp",
                }
            ]
        }), true)

        await queryRunner.createIndex("accounts", new TableIndex({
            name: "IDX_ACCOUNT_NUMBER",
            columnNames: ["account_number"]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("accounts");
        // await queryRunner.dropIndex("accounts", "IDX_ACCOUNT_NUMBER");
        await queryRunner.dropTable("accounts");
    }

}


// import {MigrationInterface, QueryRunner, Table, TableIndex, TableColumn, TableForeignKey } from "typeorm";

// export class QuestionRefactoringTIMESTAMP implements MigrationInterface {

//     async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.createTable(new Table({
//             name: "question",
//             columns: [
//                 {
//                     name: "id",
//                     type: "int",
//                     isPrimary: true
//                 },
//                 {
//                     name: "name",
//                     type: "varchar",
//                 }
//             ]
//         }), true)

//         await queryRunner.createIndex("account", new TableIndex({
//             name: "IDX_ACCOUNT_NUMBER",
//             columnNames: ["account_number"]
//         }));

//         await queryRunner.createTable(new Table({
//             name: "answer",
//             columns: [
//                 {
//                     name: "id",
//                     type: "int",
//                     isPrimary: true
//                 },
//                 {
//                     name: "name",
//                     type: "varchar",
//                 },
//                 {
//                   name: 'created_at',
//                   type: 'timestamp',
//                   default: 'now()'
//                 }
//             ]
//         }), true);

//         await queryRunner.addColumn("answer", new TableColumn({
//             name: "questionId",
//             type: "int"
//         }));

//         await queryRunner.createForeignKey("answer", new TableForeignKey({
//             columnNames: ["questionId"],
//             referencedColumnNames: ["id"],
//             referencedTableName: "question",
//             onDelete: "CASCADE"
//         }));
//     }

//     async down(queryRunner: QueryRunner): Promise<void> {
//         const table = await queryRunner.getTable("answer");
//         const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("questionId") !== -1);
//         await queryRunner.dropForeignKey("answer", foreignKey);
//         await queryRunner.dropColumn("answer", "questionId");
//         await queryRunner.dropTable("answer");
//         await queryRunner.dropIndex("question", "IDX_QUESTION_NAME");
//         await queryRunner.dropTable("question");
//     }

// }