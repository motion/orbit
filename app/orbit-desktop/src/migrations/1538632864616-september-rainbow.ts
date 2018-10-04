import { getGlobalConfig } from '@mcro/config'
import { SettingEntity } from '@mcro/entities'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1538632864616 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    // await queryRunner.query(`PRAGMA foreign_keys = OFF;`);
    await queryRunner.query(`DROP TABLE IF EXISTS 'bit_entity_people_person_entity'`);
    await queryRunner.query(`DROP TABLE IF EXISTS 'job_entity'`);
    await queryRunner.query(`DROP TABLE IF EXISTS 'bit_entity'`);
    await queryRunner.query(`DROP TABLE IF EXISTS 'person_entity'`);
    await queryRunner.query(`DROP TABLE IF EXISTS 'person_bit_entity'`);
    // await queryRunner.query(`PRAGMA foreign_keys = ON;`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}


}
