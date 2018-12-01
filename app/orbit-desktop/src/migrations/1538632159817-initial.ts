import { getGlobalConfig } from '@mcro/config'
import { pathExists, writeJSON } from 'fs-extra'
import { MigrationInterface, QueryRunner } from 'typeorm'

const Config = getGlobalConfig()

export class Migration1538632159817 implements MigrationInterface {
  public async up(_queryRunner: QueryRunner): Promise<any> {
    if ((await pathExists(Config.paths.orbitConfig)) === false) {
      await writeJSON(getGlobalConfig().paths.orbitConfig, getGlobalConfig())
    }
  }

  public async down(/* queryRunner: QueryRunner */): Promise<any> {}
}
