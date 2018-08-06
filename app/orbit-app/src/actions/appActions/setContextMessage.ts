import { App } from '@mcro/stores'

export function setContextMessage(contextMessage: string) {
  App.setState({ contextMessage })
}
