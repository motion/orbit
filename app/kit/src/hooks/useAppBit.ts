import { useModel } from '@o/bridge'
import { AppBit, AppModel } from '@o/models'
import { ContextualProps, createContextualProps } from '@o/ui'
import { ImmutableUpdateFn } from '@o/utils'
import { merge } from 'lodash'
import { FindOptions } from 'typeorm'

import { useStoresSimple } from './useStores'

export const CurrentAppBitContext: ContextualProps<{
  id?: number
  identifier?: string
}> = createContextualProps({})

export function useAppBit(
  userConditions?: FindOptions<AppBit> | false,
): [AppBit | null, ImmutableUpdateFn<AppBit>] {
  // currently used by settings panes where appStore isn't loaded
  const curApp = CurrentAppBitContext.useProps()
  const curAppId = curApp ? curApp.id : undefined
  let conditions: any = null

  if (userConditions) {
    conditions = userConditions
  } else {
    // use id for non-static apps
    conditions = { where: { id: curAppId } }
  }

  const finalConditions = merge(conditions, userConditions)
  const [app, update] = useModel(AppModel, finalConditions)

  if (!app || userConditions === false) {
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
