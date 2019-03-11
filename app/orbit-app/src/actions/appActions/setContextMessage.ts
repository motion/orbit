import { App } from '@o/stores'

export function setContextMessage(contextMessage: string) {
  App.setState({ contextMessage })
}
