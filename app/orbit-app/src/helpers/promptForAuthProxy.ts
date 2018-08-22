import { App } from '@mcro/stores'
import { sleep } from '@mcro/black'

export const promptForAuthProxy = async () => {
  let message = ''
  // await acceptsforwarding... TODO should be message
  App.setState({ acceptsForwarding: false })
  await sleep(1)
  App.setState({ acceptsForwarding: true })
  const accepted = await new Promise(res => {
    const dispose = App.onMessage(App.messages.FORWARD_STATUS, status => {
      console.log('got status', status)
      dispose()
      if (status === 'accepted') {
        res(true)
      } else {
        message = status
        res(false)
      }
    })
  })
  return {
    accepted: !!accepted,
    message,
  }
}
