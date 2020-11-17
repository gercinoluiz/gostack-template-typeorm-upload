import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTransactions1605392459181 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');  // this code aims to generate automaticlly uuid in postgrees

    await queryRunner.createTable(new Table({



      name: "transactions",
      columns: [
        {
          name: "id",
          type: "uuid",
          isPrimary: true,
          generationStrategy: "uuid",
          default: "uuid_generate_v4()"
        },

        {
          name: "type",
          type: "varchar",

        },

        {
          name: "title",
          type: "varchar"
        },

        {
          name: "value",
          type: "decimal",
          precision: 10,
          scale: 2
        },

        {
          name: "category_id",
          type: "uuid",
          isNullable: true

        },

        {
          name: 'created_at',
          type: 'timestamp', // Only available in postgress
          isNullable: false,
          default: 'now()'
        },

        {
          name: 'updated_at',
          type: 'timestamp', // Only available in postgress

          default: 'now()',
          isNullable: false
        },

      ]

    }))


    await queryRunner.createForeignKey('transactions', new TableForeignKey({
      name: "CategoryId",
      columnNames: ['category_id'],
      referencedTableName: "categories",
      referencedColumnNames: ['id'],
      onDelete: "SET NULL",
      onUpdate: "CASCADE"
    }))

  }



  public async down(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.dropForeignKey('transactions', 'CategoryId')
    await queryRunner.dropTable('transactions')

  }

}
