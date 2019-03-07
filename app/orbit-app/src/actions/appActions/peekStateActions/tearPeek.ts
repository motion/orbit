import { App, defaultPeekState } from '@o/stores'

export function tearPeek() {
  const [curPeek, ...rest] = App.peeksState
  const peeksState = [
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
  console.log('setting app state', peeksState)
  // set
  App.setState({
    peeksState,
  })
  setTimeout(() => {
    console.log('APP STATE IS NOW', App.peeksState)
  })
}
