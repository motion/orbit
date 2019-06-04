import { SpaceEntity, UserEntity } from '@o/models'
import { getRepository } from 'typeorm'

export async function getActiveSpace() {
  const user = await getRepository(UserEntity).findOne({})
  return await getRepository(SpaceEntity).findOne({ where: { id: user.activeSpace } })
}
