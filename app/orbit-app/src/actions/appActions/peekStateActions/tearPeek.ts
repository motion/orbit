import { App, defaultPeekState } from '@mcro/stores'

export function tearPeek() {
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
  console.log('next peek state', appsState)
  // set
  App.setState({
    appsState,
  })
}
