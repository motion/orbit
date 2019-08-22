import { useModel } from '@o/bridge'
import { User, UserModel } from '@o/models'
import { FindOptions } from 'typeorm'

export function useActiveUser(props?: FindOptions<User>) {
  return useModel(UserModel, props || {}, {
    observe: true,
  })
}
