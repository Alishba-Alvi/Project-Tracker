import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenToUser1787255209421 implements MigrationInterface {
    name = 'AddRefreshTokenToUser1787255209421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "refreshTokenHash" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refreshTokenHash"`);
    }

}
