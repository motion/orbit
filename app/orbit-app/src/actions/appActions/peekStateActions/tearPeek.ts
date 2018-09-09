import { App, AppState } from '@mcro/stores'

export function tearPeek() {
  const { peekState } = App
  if (!peekState.appConfig) {
    console.log('no peek to tear')
  }
  // add app to list of apps
  let appsState: AppState[] = App.appsState
  appsState = [
    ...appsState,
    {
      id: Math.random(),
      appConfig: peekState.appConfig,
      position: peekState.position,
      size: peekState.size,
    }
  ]
  App.setState({
    appsState
  })
}
