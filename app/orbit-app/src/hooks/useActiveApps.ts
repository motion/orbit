import { useModels } from '@mcro/model-bridge'
import { App, AppByType, AppModel, AppType } from '@mcro/models'
import { useActiveSpace } from './useActiveSpace'

export function useActiveApps<A extends AppType>(
  type?: A,
): A extends undefined ? App : AppByType<A>[] {
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
  return apps as any
}
