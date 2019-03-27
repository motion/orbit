import { useModel } from '@o/bridge'
import { AppBit, AppModel } from '@o/models'
import { getAppDefinition } from '../helpers/getAppDefinition'
import { Omit } from '../types'
import { AppDefinition } from '../types/AppDefinition'

type AppWithDefinition = Omit<AppDefinition, 'id' | 'name'> &
  AppBit & {
    appName: AppDefinition['name']
  }

export function useApp(id: number): [AppWithDefinition, ((next: Partial<AppBit>) => any)] {
  const [app, update] = useModel(AppModel, { where: { id } })
  if (!app) {
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
