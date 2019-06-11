import { useModels } from '@o/bridge'
import { AppBit, AppModel } from '@o/models'
import { useMemo } from 'react'

import { useActiveSpace } from './useActiveSpace'

export function useActiveApps(type?: string): AppBit[] {
  const [activeSpace] = useActiveSpace()
  let where = { spaceId: activeSpace.id }
  if (type) {
    where['type'] = type
  }
  const [apps] = useModels(AppModel, {
    where,
  })
  return useMemo(() => apps.filter(x => x.tabDisplay !== 'hidden'), [apps])
}

export const appSelectAllButData: (keyof AppBit)[] = [
  'id',
  'itemType',
  'identifier',
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
  'spaceId',
  'name',
  'tabDisplay',
  'colors',
  'token',
]
