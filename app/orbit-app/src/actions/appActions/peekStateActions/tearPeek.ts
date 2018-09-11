import { App, defaultPeekState } from '@mcro/stores'
import { stringify } from '@mcro/helpers'

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
  console.log('setting app state', appsState)
  // set
  App.setState({
    lastTear: Date.now(),
    appsState,
  })
  setTimeout(() => {
    console.log('APP STATE IS NOW', stringify(App.appsState))
  })
}
