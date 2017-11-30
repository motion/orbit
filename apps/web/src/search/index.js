import { watch, store } from '@mcro/black'
import { range } from 'lodash'
import Indexer from './indexer'
import Embedding from './embedding'
import debug from 'debug'

const log = debug('search')
log.enabled = true

@store
export default class Search {
  items = null
  searchText = ''
  autocomplete = null
  results = null
  resultsCount = null

  @watch
  indexer = () =>
    this.items && new Indexer({ items: this.items, embedding: this.embedding })
  embedding = new Embedding()

  constructor({ items, resultsCount }) {
    if (items) {
      this.items = items
    }

    this.resultsCount = resultsCount || 10

    this.react(
      () => this.searchText,
      () => {
        this.searching = true
        this.results = this.search()
        this.searching = false
        this.autocomplete = this.getAutocomplete()
      }
    )
  }

  search = () => {
    return this.indexer
      .search(this.searchText, this.resultsCount)
      .map(({ item, toBold, index, wmd, similarity, snippet }) => {
        return {
          item,
          toBold,
          wmd,
          index,
          snippet,
          similarity,
          debug: [],
        }
      })
  }

  getAutocomplete = () => {
    const important = this.indexer.documentsToImportantTerms(
      this.results.map(({ index }) => index)
    )

    return important.map(({ token, freq }) => ({ text: token, val: freq }))
  }
}
