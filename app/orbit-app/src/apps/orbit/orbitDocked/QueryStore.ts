import { react, ensure } from '@mcro/black'
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

  externalChangeAppQuery = react(
    () => App.state.query,
    query => {
      ensure('is diff', query !== this.query)
      console.log('external query update')
      this.query = query
    },
  )

  hasQuery = react(() => this.query.length)

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
