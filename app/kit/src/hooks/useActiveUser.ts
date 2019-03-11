import { useModel } from '@o/bridge'
import { userDefaultValue, UserModel } from '@o/models'

export function useActiveUser() {
  return useModel(
    UserModel,
    {},
    {
      observe: true,
      defaultValue: userDefaultValue,
    },
  )
}
