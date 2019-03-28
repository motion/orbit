import { useModel } from '@o/bridge'
import { AppBit, AppModel } from '@o/models'
import { getAppDefinition } from '../helpers/getAppDefinition'
import { Omit } from '../types'
import { AppDefinition } from '../types/AppDefinition'
import { useStoresSimple } from './useStores'

type AppWithDefinition = Omit<AppDefinition, 'id' | 'name'> &
  AppBit & {
    appName: AppDefinition['name']
  }

export function useApp(
  appId?: number | false,
): [AppWithDefinition, ((next: Partial<AppBit>) => any)] {
  const { appStore } = useStoresSimple()
  let conditions = null

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

  const definition = getAppDefinition(app.identifier)
  const appWithDefinition: AppWithDefinition = {
    ...definition,
    ...app,
    appName: definition ? definition.name : '',
    id: app.id,
  }
  return [appWithDefinition, update]
}
