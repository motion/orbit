import { useModel } from '@o/bridge'
import { AppBit, AppModel } from '@o/models'
import { ContextualProps, createContextualProps } from '@o/ui'
import { ImmutableUpdateFn } from '@o/utils'
import { FindOptions } from 'typeorm'

import { useStoresSimple } from './useStores'

export const CurrentAppBitContext: ContextualProps<{
  id?: number
  identifier?: string
}> = createContextualProps({})

export function useAppBit(
  where?: FindOptions<AppBit>['where'] | false,
): [AppBit | null, ImmutableUpdateFn<AppBit>] {
  // currently used by settings panes where appStore isn't loaded
  const curApp = CurrentAppBitContext.useProps()
  const curAppId = curApp ? curApp.id : undefined
  const conditions = { where: { id: curAppId, ...where } }

  const [app, update] = useModel(AppModel, conditions)

  if (!app || where === false) {
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
