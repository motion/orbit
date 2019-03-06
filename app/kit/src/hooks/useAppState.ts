import { useModel } from '@mcro/bridge'
import { AppModel } from '@mcro/models'
import { useStoresSimple } from './useStores'

export function useAppState() {
  const { appStore } = useStoresSimple()
  return useModel(AppModel, { where: { id: +appStore.props.id } })
}
