import { App } from '@mcro/stores'

export function showSpaceSwitcher() {
  App.setState({ showSpaceSwitcher: Date.now() })
}
