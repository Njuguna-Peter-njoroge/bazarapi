import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTBProducts1764308086711 implements MigrationInterface {
    name = 'AddTBProducts1764308086711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "price" numeric(10,2) NOT NULL DEFAULT '0', "stock" integer NOT NULL, "image" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "addedById" integer, "categoriesId" integer, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "addedById" integer`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_8e3157915cf024bc6c3eb97c468" FOREIGN KEY ("addedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_b31522e7a7f93ef47f311590a79" FOREIGN KEY ("categoriesId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_4040f168f4b94bc6f805f124f14" FOREIGN KEY ("addedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_4040f168f4b94bc6f805f124f14"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_b31522e7a7f93ef47f311590a79"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_8e3157915cf024bc6c3eb97c468"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "addedById"`);
        await queryRunner.query(`DROP TABLE "product"`);
    }

}
