import { defaultPeekState, App } from '@mcro/stores'
import { APP_ID } from '../../constants'
import { stringify } from '../../helpers'

const merge = (state, next) => {
  App.bridge.deepMergeMutate(state, next, {
    onlyKeys: Object.keys(defaultPeekState),
  })
  return state
}

const getPeekId = () => {
  return App.appsState.findIndex(app => !app.torn)
}

export const setAppState = (nextState: Partial<typeof defaultPeekState>) => {
  if (!nextState) {
    throw new Error('No appState given')
  }
  const index = APP_ID
    ? App.appsState.findIndex(app => app.id === APP_ID)
    : getPeekId()
  const myAppState = App.appsState[index]
  console.log('setAppState', stringify(nextState))
  console.log('myState', stringify(myAppState))
  const newPeekState = merge(myAppState, nextState)
  const appsState = App.appsState.splice(index, 1, newPeekState)
  console.log('new appsState', stringify(appsState))
  App.setState({ appsState })
}
