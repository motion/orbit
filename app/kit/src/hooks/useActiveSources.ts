import { useActiveSpace } from './useActiveSpace'
import { useSourcesForSpace } from './useSourcesForSpace'

export function useActiveSources() {
  const [activeSpace] = useActiveSpace()
  return useSourcesForSpace(activeSpace && activeSpace.id)
}
