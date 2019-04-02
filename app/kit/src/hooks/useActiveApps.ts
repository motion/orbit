import { useModels } from '@o/bridge'
import { AppBit, AppModel } from '@o/models'
import { useActiveSpace } from './useActiveSpace'

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

  return apps.filter(x => x.tabDisplay !== 'hidden')
}
