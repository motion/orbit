import { useActiveSpace } from './useActiveSpace'
import { useActiveApps, UseActiveAppsProps } from './useActiveApps'

export function useActiveAppsSorted(props: UseActiveAppsProps = {}) {
  const activeApps = useActiveApps(props)
  const [space] = useActiveSpace()
  if (!activeApps || !space) {
    return []
  }
  return space.paneSort.map(id => activeApps.find(x => x.id === id))
}
