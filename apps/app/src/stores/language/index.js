import { mean, uniq, sortBy, reverse, memoize } from 'lodash'

import { store } from '@mcro/black'
import dataset from './pg.json'
import Search from '@mcro/search'

@store
export default class LanguageStore {
  q = 'hacker'

  willMount() {
    this.search = new Search()
    this.search.onDocuments(dataset)
    window.s = this.search
  }
}
