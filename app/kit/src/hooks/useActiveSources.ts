import { useActiveSpace } from './useActiveSpace'
import { useSourcesForSpace } from './useAppsForSpace'

export function useActiveSources() {
  const [activeSpace] = useActiveSpace()
  return useSourcesForSpace(activeSpace && activeSpace.id)
}
