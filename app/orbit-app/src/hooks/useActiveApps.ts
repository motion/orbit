import { useObserveMany } from '@mcro/model-bridge'
import { AppModel } from '@mcro/models'
import { useStoresSafe } from './useStoresSafe'
import { SpaceStore } from '../stores/SpaceStore'

export type UseActiveAppsProps = { spaceStore?: SpaceStore }

export function useActiveApps(props: UseActiveAppsProps = {}) {
  const spaceStore = props.spaceStore || useStoresSafe().spaceStore
  if (!spaceStore) {
    throw new Error('No space store provideed')
  }
  return useObserveMany(AppModel, { where: { spaceId: spaceStore.activeSpace.id } })
}
