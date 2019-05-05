import { App, AppState, defaultPeekState } from '@o/stores'
import { PEEK_ID } from '../constants'
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
  const index =
    typeof PEEK_ID === 'number' ? App.peeksState.findIndex(app => app.id === PEEK_ID) : 0
  const myAppState = deepClone(App.peeksState[index])
  const newPeekState = mergeAppState(myAppState, nextState)
  const peeksState = [...App.peeksState]
  peeksState.splice(index, 1, newPeekState)
  App.setState({ peeksState })
}
