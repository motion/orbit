import { App } from '@mcro/stores'
import { APP_ID } from '../../constants'

export const closeApp = (id = APP_ID) => {
  if (id === null) {
    throw new Error('No app_id')
  }
  const index = App.appsState.findIndex(app => app.id === id)
  // safety
  if (index === -1) {
    console.log('no index found')
    return
  }
  const appsState = [...App.appsState]
  appsState.splice(index, 1)
  App.setState({ appsState })
}
