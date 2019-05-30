import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1538632864616 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    try {
      await Promise.all([
        queryRunner.query("DROP TABLE IF EXISTS 'bit_entity_people_person_entity'"),
        queryRunner.query("DROP TABLE IF EXISTS 'job_entity'"),
        queryRunner.query("DROP TABLE IF EXISTS 'bit_entity'"),
        queryRunner.query("DROP TABLE IF EXISTS 'person_entity'"),
        queryRunner.query("DROP TABLE IF EXISTS 'person_bit_entity'"),
      ])
    } catch (err) {
      console.log('note error, maybe not relevant', err)
    }
  }

  public async down(): Promise<any> {}
}
