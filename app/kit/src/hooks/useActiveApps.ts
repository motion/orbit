import { useModels } from '@o/bridge'
import { AppBit, AppModel } from '@o/models'
import { useMemo } from 'react'

import { useActiveSpace } from './useActiveSpace'
import { FindOptions } from 'typeorm'

export type FindBitWhere = FindOptions<AppBit>['where']

export function useActiveApps(where?: FindBitWhere): AppBit[] {
  const [activeSpace] = useActiveSpace()
  const [apps] = useModels(AppModel, {
    where: {
      spaceId: activeSpace.id,
      ...where,
    },
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
