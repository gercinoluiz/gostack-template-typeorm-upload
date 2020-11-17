import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCategoryTable1605395488464 implements MigrationInterface {



  public async up(queryRunner: QueryRunner): Promise<any> {

    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');  // this code aims to generate automaticlly uuid in postgrees


    await queryRunner.createTable(new Table({
      name: "categories",
      columns: [{
        name: "id",
        type: "uuid",
        isPrimary: true,
        generationStrategy: "uuid",
        default: "uuid_generate_v4()"

      },

      {
        name: "title",
        type: "varchar",
        isUnique: true,
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

  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('categories')
  }

}
