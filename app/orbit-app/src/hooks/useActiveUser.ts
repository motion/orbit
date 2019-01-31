import { useModel } from '@mcro/model-bridge'
import { userDefaultValue, UserModel } from '@mcro/models'

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
