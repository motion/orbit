import { useObserveOne } from '@mcro/model-bridge'
import { UserModel } from '@mcro/models'

export function useActiveUser() {
  return useObserveOne(UserModel, {})
}
