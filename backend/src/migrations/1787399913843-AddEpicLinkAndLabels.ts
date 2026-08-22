import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEpicLinkAndLabels1787399913843 implements MigrationInterface {
    name = 'AddEpicLinkAndLabels1787399913843'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "label" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "projectId" uuid NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5692ac5348861d3776eb5843672" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_label_project_name_ci" ON "label" ("projectId", LOWER("name"))`);
        await queryRunner.query(`CREATE TABLE "issue_labels" ("issueId" uuid NOT NULL, "labelId" uuid NOT NULL, CONSTRAINT "PK_08cb62907e6e166fd35af96a538" PRIMARY KEY ("issueId", "labelId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f0bd8cdd207e9aec69162259e8" ON "issue_labels"  ("issueId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b00b99744de61204ad18a22fb2" ON "issue_labels"  ("labelId") `);
        await queryRunner.query(`ALTER TABLE "issue" ADD "epicId" uuid`);
        await queryRunner.query(`ALTER TABLE "label" ADD CONSTRAINT "FK_2359bfea7db1c9aa2a0c426cf67" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issue" ADD CONSTRAINT "FK_e7f512a846f5931ca88c5e04f56" FOREIGN KEY ("epicId") REFERENCES "issue"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issue_labels" ADD CONSTRAINT "FK_f0bd8cdd207e9aec69162259e8c" FOREIGN KEY ("issueId") REFERENCES "issue"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "issue_labels" ADD CONSTRAINT "FK_b00b99744de61204ad18a22fb2a" FOREIGN KEY ("labelId") REFERENCES "label"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "issue_labels" DROP CONSTRAINT "FK_b00b99744de61204ad18a22fb2a"`);
        await queryRunner.query(`ALTER TABLE "issue_labels" DROP CONSTRAINT "FK_f0bd8cdd207e9aec69162259e8c"`);
        await queryRunner.query(`ALTER TABLE "issue" DROP CONSTRAINT "FK_e7f512a846f5931ca88c5e04f56"`);
        await queryRunner.query(`ALTER TABLE "label" DROP CONSTRAINT "FK_2359bfea7db1c9aa2a0c426cf67"`);
        await queryRunner.query(`ALTER TABLE "issue" DROP COLUMN "epicId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b00b99744de61204ad18a22fb2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f0bd8cdd207e9aec69162259e8"`);
        await queryRunner.query(`DROP TABLE "issue_labels"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_label_project_name_ci"`);
        await queryRunner.query(`DROP TABLE "label"`);
    }

}