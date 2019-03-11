import { useModel } from '@o/bridge'
import { AppModel } from '@o/models'
import { useStoresSimple } from './useStores'

export function useAppState() {
  const { appStore } = useStoresSimple()
  return useModel(AppModel, { where: { id: +appStore.props.id } })
}
