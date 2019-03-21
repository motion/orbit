import { loadOne } from '@o/bridge'
import { UserModel } from '@o/models'

export function getUser() {
  return loadOne(UserModel, {})
}
