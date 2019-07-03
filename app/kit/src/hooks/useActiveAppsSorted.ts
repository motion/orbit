import { AppBit } from '@o/models'
import memoWeak from 'memoize-weak'
import { useMemo } from 'react'

import { useActiveApps } from './useActiveApps'
import { useActivePaneSort } from './useActiveSpace'

export const sortApps: (apps: AppBit[], sort: number[]) => AppBit[] = memoWeak((apps, sort) => {
  return sort.map(id => apps.find(x => x.id === id)).filter(Boolean)
})

export function useActiveAppsSorted() {
  const activeApps = useActiveApps()
  const paneSort = useActivePaneSort()
  return useMemo(() => sortApps(activeApps, paneSort), [paneSort, activeApps])
}
