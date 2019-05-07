import { AppBit } from '@o/models'
import memoWeak from 'memoize-weak'

import { useActiveApps } from './useActiveApps'
import { useActivePaneSort } from './useActiveSpace'

export const sortApps = memoWeak((apps: AppBit[], sort: number[]) => {
  return sort.map(id => apps.find(x => x.id === id)).filter(Boolean)
})

export function useActiveAppsSorted() {
  const activeApps = useActiveApps()
  const paneSort = useActivePaneSort()
  return sortApps(activeApps, paneSort)
}
