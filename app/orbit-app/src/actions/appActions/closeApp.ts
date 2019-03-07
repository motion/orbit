import { App } from '@o/stores'
import { PEEK_ID } from '../../constants'

export const closeApp = (id = PEEK_ID) => {
  if (id === null) {
    throw new Error('No app_id')
  }
  const index = App.peeksState.findIndex(app => app.id === id)
  // safety
  if (index === -1) {
    console.log('no index found')
    return
  }
  const peeksState = [...App.peeksState]
  peeksState.splice(index, 1)
  App.setState({ peeksState })
}
