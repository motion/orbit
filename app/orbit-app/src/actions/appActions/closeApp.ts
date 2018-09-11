import { App } from '@mcro/stores'
import { APP_ID } from '../../constants'

export const closeApp = () => {
  if (!APP_ID) {
    throw new Error('No app_id')
  }
  const index = App.appsState.findIndex(app => app.id === APP_ID)
  const appsState = [...App.appsState]
  appsState.splice(index, 1)
  App.setState({ appsState })
}
