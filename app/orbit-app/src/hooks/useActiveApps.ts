import { useModels } from '@mcro/model-bridge'
import { AppByType, AppModel, AppType } from '@mcro/models'
import { useActiveSpace } from './useActiveSpace'

// TODO @umed make this with nicer types

export function useActiveApps<A extends AppType>(type?: A): AppByType<A>[] {
  const [activeSpace] = useActiveSpace()
  let where = { spaceId: activeSpace && activeSpace.id }
  if (type) {
    where['type'] = type
  }
  const [apps] = useModels(
    AppModel,
    activeSpace && {
      where,
    },
  )
  return apps as A extends undefined ? App : B[]
}
