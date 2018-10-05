import { getGlobalConfig } from '@mcro/config'
import { pathExists } from 'fs-extra'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { writeOrbitConfig } from '../helpers'

const Config = getGlobalConfig()

export class Migration1538632159817 implements MigrationInterface {
  public async up(_queryRunner: QueryRunner): Promise<any> {
    if ((await pathExists(Config.paths.orbitConfig)) === false) {
      await writeOrbitConfig()
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
