import { defaultPeekState, App } from '@mcro/stores'
import { APP_ID } from '../../constants'
import { stringify, deepClone } from '../../helpers'

const merge = (state, next) => {
  App.bridge.deepMergeMutate(state, next, {
    onlyKeys: Object.keys(defaultPeekState),
  })
  return state
}

const getPeekId = () => {
  return App.appsState[0].id
}

export const setAppState = (nextState: Partial<typeof defaultPeekState>) => {
  if (!nextState) {
    throw new Error('No appState given')
  }
  const index = APP_ID
    ? App.appsState.findIndex(app => app.id === APP_ID)
    : getPeekId()
  const myAppState = deepClone(App.appsState[index])
  const newPeekState = merge(myAppState, nextState)
  const appsState = [...App.appsState]
  appsState.splice(index, 1, newPeekState)
  console.log('now it is', stringify(appsState))
  App.setState({ appsState })
}
