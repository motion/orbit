import { useModels } from '@mcro/bridge'
import { useActiveSpace } from '@mcro/kit'
import { AppBit, AppModel } from '@mcro/models'

export function useActiveApps(type?: string): AppBit[] {
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

  return apps
}
