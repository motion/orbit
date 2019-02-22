import { useActiveSpace } from '@mcro/kit'
import { AppBit } from '@mcro/models'
import { useActiveApps } from './useActiveApps'

export function sortApps(apps: AppBit[], sort: number[]) {
  return sort.map(id => apps.find(x => x.id === id)).filter(Boolean)
}

export function useActiveAppsSorted() {
  const activeApps = useActiveApps()
  const [space] = useActiveSpace()
  // console.log('got a new value', space, activeApps)

  if (!activeApps || !space) {
    return []
  }

  return sortApps(activeApps, space.paneSort)
}
