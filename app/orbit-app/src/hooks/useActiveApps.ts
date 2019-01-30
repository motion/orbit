import { useObserveMany } from '@mcro/model-bridge'
import { App, AppByType, AppModel } from '@mcro/models'
import { useActiveSpace } from './useActiveSpace'

// TODO @umed make this with nicer types

export function useActiveApps<A extends App['type'], B extends AppByType[A]>(type?: A) {
  const [activeSpace] = useActiveSpace()
  let where = { spaceId: activeSpace && activeSpace.id }
  if (type) {
    where['type'] = type
  }
  return useObserveMany(
    AppModel,
    activeSpace && {
      where,
    },
  ) as A extends undefined ? App : B[]
}
