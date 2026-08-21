import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProjectTables1787353877507 implements MigrationInterface {
    name = 'CreateProjectTables1787353877507'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "name" character varying NOT NULL, "description" text, "isArchived" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2db22c052f9ffdd51a6c113b37b" UNIQUE ("key"), CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "projectId" uuid NOT NULL, "userId" uuid NOT NULL, "projectRole" character varying NOT NULL DEFAULT 'member', CONSTRAINT "UQ_1f95533c37d5a7215c796d6ac9f" UNIQUE ("projectId", "userId"), CONSTRAINT "PK_64dba8e9dcf96ce383cfd19d6fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "project_member" ADD CONSTRAINT "FK_7115f82a61e31ac95b2681d83e4" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_member" ADD CONSTRAINT "FK_e7520163dafa7c1104fd672caad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_member" DROP CONSTRAINT "FK_e7520163dafa7c1104fd672caad"`);
        await queryRunner.query(`ALTER TABLE "project_member" DROP CONSTRAINT "FK_7115f82a61e31ac95b2681d83e4"`);
        await queryRunner.query(`DROP TABLE "project_member"`);
        await queryRunner.query(`DROP TABLE "project"`);
    }

}
