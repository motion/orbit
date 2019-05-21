import { ImmutableUpdateFn } from '@o/bridge'
import { AppBit } from '@o/models'

import { getAppDefinition } from '../helpers/getAppDefinition'
import { AppDefinition } from '../types/AppTypes'
import { useAppBit } from './useAppBit'

export function useAppWithDefinition(
  appId?: number | false,
): [AppBit, AppDefinition, ImmutableUpdateFn<AppBit>] {
  const [app, update] = useAppBit(appId)
  if (!app) {
    return [null, null, null]
  }
  const definition = getAppDefinition(app.identifier)
  return [app, definition, update]
}
