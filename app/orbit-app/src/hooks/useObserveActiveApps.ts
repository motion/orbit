import { useObserveMany } from '@mcro/model-bridge'
import { AppModel } from '@mcro/models'
import { useStoresSafe } from './useStoresSafe'

export function useObserveActiveApps() {
  const { spaceStore } = useStoresSafe()
  if (!spaceStore) {
    throw new Error('No space store provideed')
  }
  return useObserveMany(AppModel, { where: { spaceId: spaceStore.activeSpace.id } })
}
