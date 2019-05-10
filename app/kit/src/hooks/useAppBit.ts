import { ImmutableUpdateFn, useModel } from '@o/bridge'
import { AppBit, AppModel } from '@o/models'

import { useStoresSimple } from './useStores'

export function useAppBit(
  appId?: number | false,
  extraConditions?,
): [AppBit, ImmutableUpdateFn<AppBit>] {
  const { appStore } = useStoresSimple()
  if (!appStore) {
    console.warn('no app store?')
    return [null, null]
  }
  let conditions = extraConditions || null

  if (appId || +appStore.id === +appStore.id) {
    // use id for non-static apps
    conditions = { where: { id: appId || +appStore.id } }
  } else {
    // use identifier for static apps (theres only one)
    conditions = { where: { identifier: appStore.identifier } }
  }
  const [app, update] = useModel(AppModel, conditions)

  if (!app || appId === false) {
    return [null, update]
  }

  return [app, update]
}
