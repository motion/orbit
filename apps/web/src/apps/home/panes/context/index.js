import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import stemmer from './stemmer'
import Pane from '../pane'
import { sum, min, sortBy, memoize, includes, reverse } from 'lodash'
import alphaNumeric from './alphaNumeric'
import stopwords from './stopwords'
import news from './news'
import tfidf from './tfidf'
import ContextSidebar from './sidebar'

import { Array1D, NDArrayMathCPU, Scalar } from 'deeplearn'

window.a1d = Array1D

const math = new NDArrayMathCPU()
window.ma = math

class ContextStore {
  vectors = {}
  news = news
  search = ''
  last = []

  get = async () => {
    const text = await (await fetch('/vectors15k.txt')).text()
    text.split('\n').forEach(line => {
      const split = line.split(' ')
      const word = split[0]
      const vectors = new Uint16Array(
        split.slice(1).map(i => Math.floor(+i * 100))
      )
      this.vectors[word] = vectors
    })
    this.tfidf = tfidf(this.news.map(this.docToWords))
    window.context = this
  };

  distance = memoize((key, w, w2) => {
    const v = this.vectors[w]
    const v2 = this.vectors[w2]
    const res = Math.sqrt(
      sum(v.map((col, index) => Math.pow(Math.abs(col - v2[index]), 2)))
    )
    return res
  })

  wordsDistances = (ws, ws2) => {
    return sum(
      ws.map(w => min(ws2.map(w2 => this.distance(w + '-' + w2, w, w2))))
    )
  }

  docToWords = memoize(s => {
    return s
      .toLowerCase()
      .split(' ')
      .filter(
        w =>
          w.length > 0 &&
          alphaNumeric(w) &&
          !includes(stopwords, w) &&
          w in this.vectors
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

  closestNews = s => {
    const queryWords = this.docToWords(s)
    console.time('get items')
    const items = news
      // .map(doc => doc.slice(4))
      .map(doc => ({
        similarity: this.docDistances(queryWords, doc),
        doc,
      }))

    console.timeEnd('get items')
    return sortBy(items, 'similarity').slice(0, 5)
  }

  go = () => {
    const start = +Date.now()
    this.last = this.closestNews(this.search)
    this.perf = +Date.now() - start
  }

  willMount() {
    this.get()
  }
}

@view({
  store: ContextStore,
})
class Context {
  render({ store }) {
    return (
      <context>
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
      </context>
    )
  }

  static style = {
    context: {
      margin: 20,
    },
    answers: {
      margin: 40,
    },
  }
}

export default {
  Sidebar: ContextSidebar,
  Main: Context,
}
