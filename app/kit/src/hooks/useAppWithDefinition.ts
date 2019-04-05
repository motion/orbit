import { AppBit } from '@o/models'
import { getAppDefinition } from '../helpers/getAppDefinition'
import { Omit } from '../types'
import { AppDefinition } from '../types/AppDefinition'
import { useAppBit } from './useAppBit'

type AppWithDefinition = Omit<AppDefinition, 'id' | 'name'> &
  AppBit & {
    appName: AppDefinition['name']
  }

export function useAppWithDefinition(
  appId?: number | false,
): [AppWithDefinition, ((next: Partial<AppBit>) => any)] {
  const [app, update] = useAppBit(appId)
  if (!app) {
    return [null, null]
  }
  const definition = getAppDefinition(app.identifier)
  const appWithDefinition = {
    ...definition,
    ...app,
    appName: definition ? definition.name : '',
    id: app.id,
  }
  return [appWithDefinition, update]
}
