import { useActiveApps } from './useActiveApps'
import { useActiveSpace } from './useActiveSpace'

export function useActiveAppsSorted() {
  const activeApps = useActiveApps()
  const [space] = useActiveSpace()
  // console.log('got a new value', space, activeApps)

  if (!activeApps || !space) {
    return []
  }

  return space.paneSort.map(id => activeApps.find(x => x.id === id)).filter(Boolean)
}
