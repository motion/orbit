import { save } from '@o/bridge'
import { User, UserModel } from '@o/models'
import { getUser } from './getUser'

export async function saveUser(next: Partial<User>) {
  const cur = await getUser()
  await save(UserModel, {
    ...cur,
    ...next,
  })
}
