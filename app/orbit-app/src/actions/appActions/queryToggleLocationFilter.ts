import { App } from '@mcro/stores'

export function queryToggleLocationFilter(location: string) {
  if (App.state.query.indexOf(location) === -1) {
    App.setState({ query: `${App.state.query.trim()} in:${location}` })
  }
}
