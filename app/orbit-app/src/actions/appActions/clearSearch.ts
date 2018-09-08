import { App } from '@mcro/stores'

export const clearSearch = () => {
  App.setState({ query: '' })
}
