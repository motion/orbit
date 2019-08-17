import { useModel } from '@o/bridge'
import { User, userDefaultValue, UserModel } from '@o/models'
import { FindOptions } from 'typeorm'

export function useActiveUser(props?: FindOptions<User>) {
  return useModel(UserModel, props || {}, {
    observe: true,
    defaultValue: userDefaultValue,
  })
}
