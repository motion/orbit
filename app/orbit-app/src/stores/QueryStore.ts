import { react } from '@mcro/black'
import { App } from '@mcro/stores'

export class QueryStore {
  query = App.state.query

  updateAppQuery = react(
    () => this.query,
    async (query, { sleep }) => {
      // slight debounce for super fast typing
      await sleep(50)
      App.setState({ query })
    },
  )

  clearQuery = () => {
    this.query = ''
  }

  setQuery = value => {
    this.query = value
  }

  onChangeQuery = e => {
    this.query = e.target.value
  }
}
