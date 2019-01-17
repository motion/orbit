import { App, AppState, defaultPeekState } from '@mcro/stores'
import { APP_ID } from '../constants'
import { deepClone } from '../helpers'

const mergeAppState = (state: AppState, next: Partial<AppState>) => {
  App.bridge.updateStateWithDiff(state, next, {
    onlyKeys: Object.keys(defaultPeekState),
  })
  return state
}

export const setAppState = (nextState: Partial<typeof defaultPeekState>) => {
  if (!nextState) {
    throw new Error('No appState given')
  }
  const index = typeof APP_ID === 'number' ? App.appsState.findIndex(app => app.id === APP_ID) : 0
  const myAppState = deepClone(App.appsState[index])
  const newPeekState = mergeAppState(myAppState, nextState)
  const appsState = [...App.appsState]
  appsState.splice(index, 1, newPeekState)
  App.setState({ appsState })
}
