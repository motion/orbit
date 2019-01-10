import { useObserveMany } from '@mcro/model-bridge'
import { AppModel } from '@mcro/models'
import { StoreContext } from '@mcro/black'
import { useContext } from 'react'

export function useObserveActiveApps() {
  const { spaceStore } = useContext(StoreContext)
  return useObserveMany(AppModel, { where: { spaceId: spaceStore.activeSpace.id } })
}
