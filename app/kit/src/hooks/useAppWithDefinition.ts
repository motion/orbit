import { ImmutableUpdateFn } from '@o/bridge'
import { AppBit, AppDefinition } from '@o/models'

import { getAppDefinition } from '../helpers/getAppDefinition'
import { useAppBit } from './useAppBit'

export function useAppWithDefinition(
  appId?: number | false,
): [AppBit, AppDefinition, ImmutableUpdateFn<AppBit>] | [null, null, null] {
  const [app, update] = useAppBit(appId)
  const definition = getAppDefinition((app && app.identifier) || '')
  if (!app || !definition) {
    console.warn('no app or definition', appId)
    return [null, null, null]
  }
  return [app, definition, update]
}
