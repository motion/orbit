import * as React from 'react'
import { Thing } from '~/app'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import stemmer from './stemmer'
// import Pane from '../pane'
import {
  sum,
  countBy,
  flatten,
  min,
  sortBy,
  memoize,
  includes,
  reverse,
} from 'lodash'
import alphaNumeric from './alphaNumeric'
import stopwords from './stopwords'
import news from './news'
import tfidf from './tfidf'
// import ContextSidebar from './sidebar'

// import { Array1D, NDArrayMathCPU, Scalar } from 'deeplearn'

let vectors = null

export default class ContextStore {
  vectors = {}
  // news = news
  search = ''
  things = null
  last = []

  get = async () => {
    if (vectors !== null) {
      this.vectors = vectors
      this.setSpecial()
      this.tfidf = tfidf(this.items.map(this.docToWords))
      return true
    }

    const text = await (await fetch('/vectors100k.txt')).text()

    vectors = {}
    text.split('\n').forEach(line => {
      const split = line.split(' ')
      const word = split[0]
      const vsList = new Uint16Array(
        split.slice(1).map(i => Math.floor(+i * 100))
      )
      vectors[word] = vsList
    })
    this.vectors = vectors
    this.setSpecial()
    this.tfidf = tfidf(this.items.map(this.docToWords))
    return true
  };

  get items() {
    return (this.things || []).map(i => i.title)
  }

  distance = memoize((key, w, w2) => {
    if (this.special[w] || this.special[w2]) {
      if (w === w2) return 0
      return 300
    }

    const v = this.vectors[w] || []
    const v2 = this.vectors[w2]
    const res = Math.sqrt(
      sum(v.map((col, index) => Math.pow(Math.abs(col - v2[index]), 2)))
    )

    return res
  })

  special = {}
  setSpecial() {
    const wordMap = {
      couldnt: 'cannot',
      doesnt: 'dont',
    }

    const clean = i => i.replace(/[^0-9a-zA-Z\ ]/g, '').toLowerCase()

    const counts = countBy(
      flatten(
        this.items.map(item =>
          item
            .split(' ')
            .map(clean)
            .map(i => (wordMap[i] ? wordMap[i] : i))
            .filter(i => typeof i === 'string' && !this.vectors[i])
        )
      )
    )

    this.allCounts = counts

    const out = {}

    Object.keys(counts).forEach(name => {
      if (counts[name] > 2) out[name] = counts[name]
    })

    this.special = out

    /*

    return reverse(
      sortBy(
        Object.keys(counts).map(name => ({ count: counts[name], name })),
        'count'
      )
    )
      // .map(c => `${c.name} - ${c.count}`)
    */
  }

  wordsDistances = (ws, ws2) => {
    return sum(
      ws.map(w => min(ws2.map(w2 => this.distance(w + '-' + w2, w, w2))))
    )
  }

  docToWords = memoize(s => {
    return s
      .replace(/[^0-9a-zA-Z\ ]/g, '')
      .toLowerCase()
      .split(' ')
      .filter(
        w =>
          w.length > 0 &&
          !includes(stopwords, w) &&
          (w in this.vectors || this.special[w])
      )
  })

  mostImportant = doc =>
    reverse(sortBy(this.tfidf(this.docToWords(doc)), 'rank'))
      .slice(0, 5)
      .map(item => item.t)

  docDistances = (s, s2) => {
    const w2 = sortBy(this.tfidf(this.docToWords(s2)), 'rank')
      .slice(-5)
      .map(({ t }) => t)
    return this.wordsDistances(s, w2)
  }

  closestItems = s => {
    const queryWords = this.docToWords(s)
    const items = this.items
      // .map(doc => doc.slice(4))
      .map(doc => ({
        similarity: this.docDistances(queryWords, doc),
        doc,
      }))

    console.timeEnd('get items')
    return sortBy(items, 'similarity').slice(0, 5)
  }
  constructor({ search }) {
    this.search = search
    this.willMount()
  }

  go = () => {
    const start = +Date.now()
    this.last = this.closestItems(this.search).map(
      title => this.things.filter(t => t.title === title)[0]
    )
    this.perf = +Date.now() - start
  }

  willMount() {
    Thing.find()
      .exec()
      .then(async ts => {
        this.things = ts
        await this.get()
        this.last = this.closestItems(this.search).map(
          item =>
            this.things.filter(t => {
              return t.title === item.doc
            })[0]
        )
      })
    // this.get()
  }
}

@view({
  store: ContextStore,
})
class Context {
  render({ store }) {
    /*
    return (
      this.props.render
        <UI.Theme name="light">
          <UI.Title size={2}>Context</UI.Title>
          <textarea
            css={{ width: '100%', height: 300 }}
            value={store.search}
            onChange={e => (store.search = e.target.value)}
          />
          <UI.Button onClick={() => store.go()}>go</UI.Button>
          <words>
            your words {JSON.stringify(store.docToWords(store.search))}
          </words>
          <answers>
            <perf>took {store.perf}ms</perf>
            {store.last.map(item => (
              <answer
                onClick={() => {
                  store.search = item.doc
                  store.go()
                }}
                css={{ marginTop: 10 }}
              >
                <similarity>similarity: {item.similarity}</similarity>
                <words if={false}>
                  words: {JSON.stringify(store.docToWords(item.doc))}
                </words>
                <tfidf>
                  most important:{' '}
                  {JSON.stringify(store.mostImportant(item.doc))}
                </tfidf>
                <UI.Text>{item.doc}</UI.Text>
              </answer>
            ))}
          </answers>
        </UI.Theme>
        <UI.Theme name="dark">
          <answers>
            {store.last.map(item => (
              <answer
                onClick={() => {
                  store.search = item.doc
                  store.go()
                }}
                css={{ marginTop: 10 }}
              >
                <UI.Text $similarity>similarity: {item.similarity}</UI.Text>
                <UI.Text $words if={false}>
                  words: {JSON.stringify(store.docToWords(item.doc))}
                </UI.Text>
                <UI.Text $tfidf>
                  most important:{' '}
                  {JSON.stringify(store.mostImportant(item.doc))}
                </UI.Text>
                <UI.Text>{item.doc}</UI.Text>
              </answer>
            ))}
          </answers>
        </UI.Theme>
      </context>
    )
    */
  }

  static style = {}
}

/*
export default {
  Sidebar: ContextSidebar,
  Main: Context,
}

*/
