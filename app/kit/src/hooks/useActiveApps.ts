import { useModels } from '@o/bridge'
import { AppBit, AppModel } from '@o/models'

import { useActiveSpace } from './useActiveSpace'

export function useActiveApps(type?: string): AppBit[] {
  const [activeSpace] = useActiveSpace()
  let where = { spaceId: activeSpace.id }
  if (type) {
    where['type'] = type
  }
  console.log('activeSpace', activeSpace, where)
  const [apps] = useModels(AppModel, {
    where,
    select: appSelectAllButDataAndTimestamps,
  })

  console.log('got apps', apps)

  return apps.filter(x => x.tabDisplay !== 'hidden')
}

export const appSelectAllButData: (keyof AppBit)[] = [
  'id',
  'itemType',
  'identifier',
  'sourceIdentifier',
  'spaceId',
  'name',
  'tabDisplay',
  'colors',
  'token',
  'updatedAt',
  'createdAt',
]

export const appSelectAllButDataAndTimestamps: (keyof AppBit)[] = [
  'id',
  'itemType',
  'identifier',
  'sourceIdentifier',
  'spaceId',
  'name',
  'tabDisplay',
  'colors',
  'token',
]

export const appSelectAllButTimestamps: (keyof AppBit)[] = [
  'id',
  'itemType',
  'identifier',
  'sourceIdentifier',
  'spaceId',
  'name',
  'tabDisplay',
  'colors',
  'token',
]
