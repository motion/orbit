import { App } from '@mcro/stores'

// TODO: make these check the actual segments, requires interaction with segment store

export function queryToggleLocationFilter(location: string) {
  if (App.state.query.indexOf(location) === -1) {
    App.setState({ query: `${App.state.query.trim()} in:${location}` })
  }
}

export function queryTogglePersonFilter(person: string) {
  if (App.state.query.indexOf(person) === -1) {
    App.setState({ query: `${App.state.query.trim()} ${person}` })
  }
}

export function queryToggleFilter(str: string) {
  if (App.state.query.indexOf(str) === -1) {
    App.setState({ query: `${App.state.query.trim()} ${str}` })
  }
}
