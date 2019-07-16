import { ImmutableUpdateFn, useModel } from '@o/bridge'
import { AppBit, AppModel } from '@o/models'
import { ContextualProps, createContextualProps } from '@o/ui'
import { isDefined, selectDefined } from '@o/utils'
import { merge } from 'lodash'

import { useStoresSimple } from './useStores'

export const CurrentAppBitContext: ContextualProps<{
  id?: number
  identifier?: string
}> = createContextualProps({})

export function useAppBit(
  appId?: number | false,
  extraConditions?,
): [AppBit | null, ImmutableUpdateFn<AppBit>] {
  // currently used by settings panes where appStore isn't loaded
  const curApp = CurrentAppBitContext.useProps()
  // TODO may want to just deprecate appStore in favor of above
  const appStoreId = useCurrentAppId()

  const id = selectDefined(appId, curApp ? curApp.id : undefined, appStoreId)

  const currentAppIdentifier = useCurrentAppIdentifier()
  let conditions: any = null

  if (isDefined(id)) {
    // use id for non-static apps
    conditions = { where: { id } }
  } else {
    // use identifier for static apps (theres only one)
    conditions = { where: { identifier: currentAppIdentifier } }
  }

  const finalConditions = merge(conditions, extraConditions)
  const [app, update] = useModel(AppModel, finalConditions)

  if (!app || appId === false) {
    return [null, update]
  }

  return [app, update]
}

export function useCurrentAppId() {
  const { appStore } = useStoresSimple()
  return appStore ? +appStore.id : undefined
}

export function useCurrentAppIdentifier() {
  const { appStore } = useStoresSimple()
  return appStore ? appStore.identifier : undefined
}
