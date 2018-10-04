import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1538632864616 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE IF EXISTS \'bit_entity_people_person_entity\'')
    await queryRunner.query('DROP TABLE IF EXISTS \'job_entity\'')
    await queryRunner.query('DROP TABLE IF EXISTS \'bit_entity\'')
    await queryRunner.query('DROP TABLE IF EXISTS \'person_entity\'')
    await queryRunner.query('DROP TABLE IF EXISTS \'person_bit_entity\'')
  }

  public async down(): Promise<any> {}
}
