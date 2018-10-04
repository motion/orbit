import { MigrationInterface } from 'typeorm'
import { remove } from 'fs-extra'
import { COSAL_DB } from '../constants'

export class CosalReset1538695904657 implements MigrationInterface {
  public async up(): Promise<any> {
    await remove(COSAL_DB)
  }
  public async down(): Promise<any> {}
}
