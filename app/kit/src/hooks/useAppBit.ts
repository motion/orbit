import { ImmutableUpdateFn, useModel } from '@o/bridge'
import { AppBit, AppModel } from '@o/models'

import { useStoresSimple } from './useStores'

export function useAppBit(
  appId?: number | false,
  extraConditions?,
): [AppBit, ImmutableUpdateFn<AppBit>] {
  const currentAppId = useCurrentAppId()
  const currentAppIdentifier = useCurrentAppIdentifier()
  let conditions = extraConditions || null

  if (appId) {
    // use id for non-static apps
    conditions = { where: { id: appId || currentAppId } }
  } else {
    // TODO this may be legacy now
    debugger
    // use identifier for static apps (theres only one)
    conditions = { where: { identifier: currentAppIdentifier } }
  }
  const [app, update] = useModel(AppModel, conditions)

  if (!app || appId === false) {
    return [null, update]
  }

  return [app, update]
}

export function useCurrentAppId() {
  const { appStore } = useStoresSimple()
  return +appStore.id
}

export function useCurrentAppIdentifier() {
  const { appStore } = useStoresSimple()
  return appStore.identifier
}
