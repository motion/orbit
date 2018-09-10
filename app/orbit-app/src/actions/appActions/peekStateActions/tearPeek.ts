import { App } from '@mcro/stores'
import { last } from 'lodash'

export function tearPeek() {
  const { peekState } = App
  if (!peekState.appConfig) {
    console.log('no peek to tear')
  }
  // push new peek app
  App.setState({
    appsState: [...App.appsState, last(App.appsState) + 1],
  })
}
