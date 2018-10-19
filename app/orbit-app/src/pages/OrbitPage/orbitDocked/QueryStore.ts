import { react, ensure } from '@mcro/black'
import { App, Desktop } from '@mcro/stores'

export class QueryStore {
  query = App.state.query

  updateAppQuery = react(
    () => this.query,
    async (query, { sleep }) => {
      // slight debounce for super fast typing
      await sleep(30)
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

  setAppQueryOnSalientOCR = react(
    () => Desktop.ocrState.salientWords,
    words => {
      ensure('words', !!words)
      this.query = words.join(' ')
    },
  )

  hasQuery = react(() => !!this.query.length, _ => _)

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
