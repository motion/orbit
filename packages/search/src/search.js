import Indexer from './indexer'
import Embedding from './embedding'
import debug from 'debug'
import { store, watch } from '@mcro/black/store'

const log = debug('search')
log.enabled = true

@store
export default class Search {
  documents = null
  autocomplete = null
  results = null
  resultsCount = null
  embedding = new Embedding()

  willMount() {
    this.resultsCount = 10
  }

  setDocuments = documents => {
    this.documents = documents
    this.indexer = new Indexer({
      documents: this.documents,
      embedding: this.embedding,
    })
  }

  search = async query => {
    if (!this.indexer) return false

    return await this.indexer.search(query, this.resultsCount)
  }
}
