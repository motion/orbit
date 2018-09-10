import { App, defaultPeekState } from '@mcro/stores'

export function tearPeek() {
  const { peekState } = App
  if (!peekState.appConfig) {
    console.log('no peek to tear')
  }
  const [curPeek, ...rest] = App.appsState
  // make current peek torn
  curPeek.torn = true
  // push new peek app
  const nextPeek = { ...defaultPeekState, id: curPeek.id + 1 }
  const appsState = [nextPeek, curPeek, ...rest]
  // set
  App.setState({
    appsState,
  })
}
