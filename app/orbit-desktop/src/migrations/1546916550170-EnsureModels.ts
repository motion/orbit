import { MigrationInterface, getRepository } from 'typeorm'
import { UserEntity, SpaceEntity } from '@mcro/models'

export class EnsureModels1546916550169 implements MigrationInterface {
  public async up(): Promise<any> {
    await this.ensureDefaultUser()
  }

  private async ensureDefaultUser() {
    const user = await getRepository(UserEntity).findOne({})
    const firstSpace = await getRepository(SpaceEntity).findOne({})

    if (!user) {
      await getRepository(UserEntity).save({
        activeSpace: firstSpace.id,
      })
    }
  }

  public async down(): Promise<any> {}
}
