import { MigrationInterface, QueryRunner } from "typeorm";

export class File31740047327558 implements MigrationInterface {
    name = 'File31740047327558'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "review" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "review"`);
    }

}
