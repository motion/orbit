import { MigrationInterface, getRepository } from 'typeorm'
import { UserEntity } from '@mcro/models'

export class EnsureModels1546916550169 implements MigrationInterface {
  public async up(): Promise<any> {
    await this.ensureDefaultUser()
  }

  private async ensureDefaultUser() {
    const user = await getRepository(UserEntity).findOne()

    if (!user) {
      await getRepository(UserEntity).save({})
    }
  }

  public async down(): Promise<any> {}
}
