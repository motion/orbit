import { ensure, react } from '@o/use-store'
import * as React from 'react'
import Saliency from './Saliency'

export class SearchStore {
  query = 'blast off'

  querySetter = val => () => {
    this.query = val
  }

  results = react(
    async () => {
      const res = await fetch(`http://localhost:4444/search?query=${this.query}`).then(res =>
        res.json(),
      )
      ensure('isArray', Array.isArray(res))
      return res
    },
    {
      defaultValue: [],
    },
  )

  topics = react(
    () => this.results.map(x => x.text).join(' '),
    async query => {
      const res = await fetch(`http://localhost:4444/topics?query=${query}`).then(res => res.json())
      ensure('isArray', Array.isArray(res))
      return res
    },
    {
      defaultValue: [],
    },
  )

  topWords = react(() => fetch(`http://localhost:4444/topWords`).then(res => res.json()), {
    defaultValue: [],
  })
}

// const decorate = compose(
//   attach({
//     store: SearchStore,
//   }),
//   view,
// )
export default (function Search({ store }) {
  window['store'] = store
  return (
    <div style={{ padding: 50 }}>
      <div style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <input
          style={{ width: 500, fontSize: 20 }}
          onChange={e => (store.query = e.target.value)}
          value={store.query}
        />
        <Saliency query={store.query} />
      </div>

      <div style={{ flexDirection: 'row', flex: 1 }}>
        <div style={{ flex: 2 }}>
          <div
            style={{
              padding: 20,
              flexWrap: 'wrap',
              lineHeight: '1.5rem',
              fontSize: 18,
            }}
          >
            <h4>Search results</h4>
            {store.results.map((result, index) => (
              <div key={index} style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 10 }}>{result.distance}</span>
                <p>{result.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              padding: 10,
              flexWrap: 'wrap',
              lineHeight: '1.5rem',
              fontSize: 18,
            }}
          >
            <h4>Top topics for results</h4>
            {store.topics.map((result, index) => (
              <div
                key={index}
                style={{ marginBottom: 10 }}
                onClick={store.querySetter(result.topic)}
              >
                <span style={{ fontSize: 10 }}>{result.distance}</span>
                <p>{result.topic}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              padding: 10,
              flexWrap: 'wrap',
              lineHeight: '1.5rem',
              fontSize: 18,
            }}
          >
            <h4>Top words across corpus</h4>
            {store.topWords.map((word, index) => (
              <div key={index} style={{ marginBottom: 10 }} onClick={store.querySetter(word)}>
                <p>{word}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})
