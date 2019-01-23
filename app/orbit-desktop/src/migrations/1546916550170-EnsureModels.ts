import { SpaceEntity, UserEntity } from '@mcro/models'
import { getRepository, MigrationInterface } from 'typeorm'

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

    if (!user.spaceConfig) {
      await getRepository(UserEntity).save({
        ...user,
        spaceConfig: {},
      })
    }
  }

  public async down(): Promise<any> {}
}
