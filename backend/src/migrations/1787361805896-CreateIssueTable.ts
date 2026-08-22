import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateIssueTable1787361805896 implements MigrationInterface {
    name = 'CreateIssueTable1787361805896'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "issue" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "projectId" uuid NOT NULL, "number" integer NOT NULL, "key" character varying NOT NULL, "title" character varying NOT NULL, "description" text, "type" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'to_do', "priority" character varying NOT NULL, "reporterId" uuid, "assigneeId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2a4d0ec7014625927ee1f8205fc" UNIQUE ("projectId", "number"), CONSTRAINT "PK_f80e086c249b9f3f3ff2fd321b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "issue" ADD CONSTRAINT "FK_be30b91466b730c5e25f1181f79" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issue" ADD CONSTRAINT "FK_668ba5ace621b4afbb808f2af48" FOREIGN KEY ("reporterId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issue" ADD CONSTRAINT "FK_d92e4c455673ad050d998bb2c56" FOREIGN KEY ("assigneeId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "issue" DROP CONSTRAINT "FK_d92e4c455673ad050d998bb2c56"`);
        await queryRunner.query(`ALTER TABLE "issue" DROP CONSTRAINT "FK_668ba5ace621b4afbb808f2af48"`);
        await queryRunner.query(`ALTER TABLE "issue" DROP CONSTRAINT "FK_be30b91466b730c5e25f1181f79"`);
        await queryRunner.query(`DROP TABLE "issue"`);
    }

}
