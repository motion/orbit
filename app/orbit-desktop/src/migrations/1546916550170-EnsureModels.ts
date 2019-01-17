import { MigrationInterface, getRepository } from 'typeorm'
import { UserEntity, SpaceEntity } from '@mcro/models'

export class EnsureModels1546916550169 implements MigrationInterface {
  public async up(): Promise<any> {
    await this.ensureDefaultUser()
  }

  private async ensureDefaultUser() {
    const user = await getRepository(UserEntity).findOne({})
    const firstSpace = await getRepository(SpaceEntity).findOne({})

    if (!firstSpace) {
      throw new Error('Should be at least one space...')
    }

    if (!user) {
      await getRepository(UserEntity).save({
        name: 'Me',
        activeSpace: firstSpace.id,
      })
    }
  }

  public async down(): Promise<any> {}
}
