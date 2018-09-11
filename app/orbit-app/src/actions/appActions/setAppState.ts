import { defaultPeekState, App } from '@mcro/stores'
import { APP_ID } from '../../constants'
import { stringify, deepClone } from '../../helpers'

const merge = (state, next) => {
  App.bridge.deepMergeMutate(state, next, {
    onlyKeys: Object.keys(defaultPeekState),
  })
  return state
}

export const setAppState = (nextState: Partial<typeof defaultPeekState>) => {
  if (!nextState) {
    throw new Error('No appState given')
  }
  console.log('starting as', stringify(App.appsState))
  const index =
    typeof APP_ID === 'number'
      ? App.appsState.findIndex(app => app.id === APP_ID)
      : 0
  const myAppState = deepClone(App.appsState[index])
  const newPeekState = merge(myAppState, nextState)
  const appsState = [...App.appsState]
  appsState.splice(index, 1, newPeekState)
  console.log('now it is', stringify(appsState))
  App.setState({ appsState })
}
