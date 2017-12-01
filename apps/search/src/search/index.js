import 'babel-polyfill'

// import { store, watch } from '@mcro/black/store'
import { range } from 'lodash'
import Indexer from './indexer'
import Embedding from './embedding'
import debug from 'debug'
import { store, watch } from '@mcro/black/store'

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
    console.log('in worker', items)
    if (items) {
      this.items = items
    }

    this.resultsCount = resultsCount || 10

    /*
    this.react(
      () => this.searchText,
      () => {
        this.searching = true
        this.results = this.search()
        this.searching = false
        this.autocomplete = this.getAutocomplete()
      }
    )
    */
  }

  search = async () => {
    console.log('going to run', this.searchText)
    const searchResponse = await this.indexer.search(
      this.searchText,
      this.resultsCount
    )
    if (searchResponse === false) {
      return false
    }
    this.results = searchResponse.map(
      ({ item, toBold, index, wmd, similarity, snippet }) => {
        return {
          item,
          toBold,
          wmd,
          index,
          snippet,
          similarity,
          debug: [],
        }
      }
    )
  }

  getAutocomplete = () => {
    const important = this.indexer.documentsToImportantTerms(
      this.results.map(({ index }) => index)
    )

    return important.map(({ token, freq }) => ({ text: token, val: freq }))
  }
}

let search = null

onmessage = async e => {
  if (e.data.type === 'index') {
    search = new Search({ items: e.data.items })
  }

  if (e.data.type === 'search') {
    search.searchText = e.data.text
    console.time('searching ' + search.searchText)
    const val = await search.search()
    console.timeEnd('searching ' + search.searchText)
    if (val !== false) {
      postMessage(search.results)
    } else {
      console.log('we cancelled ', e.data.text)
    }
  }
}
