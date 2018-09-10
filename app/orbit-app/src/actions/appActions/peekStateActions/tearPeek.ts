import { App, defaultPeekState } from '@mcro/stores'

export function tearPeek() {
  const { peekState } = App
  if (!peekState.appConfig) {
    console.log('no peek to tear')
  }
  const [curPeek, ...rest] = App.appsState
  const appsState = [
    // create next peek
    {
      ...defaultPeekState,
      id: curPeek.id + 1,
    },
    // tear current
    {
      ...curPeek,
      torn: true,
    },
    ...rest,
  ]
  // set
  App.setState({
    appsState,
  })
}
