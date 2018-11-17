import * as React from 'react'
import { react, compose, view, attach, ensure } from '@mcro/black'
import { Saliency } from './Saliency'

class SearchStore {
  query = 'visit another planet'

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
    () => this.results[0].text,
    async query => {
      const res = await fetch(`http://localhost:4444/topics?query=${query}`).then(res => res.json())
      ensure('isArray', Array.isArray(res))
      return res
    },
    {
      defaultValue: [],
    },
  )
}

const decorate = compose(
  attach({
    store: SearchStore,
  }),
  view,
)
export const Search = decorate(({ store }) => {
  window['store'] = store
  return (
    <div style={{ padding: 50 }}>
      <input
        style={{ width: 500, fontSize: 20 }}
        onChange={e => (store.query = e.target.value)}
        value={store.query}
      />
      <Saliency query={store.query} />

      <div style={{ flexFlow: 'row' }}>
        <div style={{ width: '50%' }}>
          <div
            style={{
              padding: 20,
              flexWrap: 'wrap',
              lineHeight: '1.5rem',
              fontSize: 18,
            }}
          >
            {store.results.map((result, index) => (
              <div key={index} style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 10 }}>{result.distance}</span>
                <p>{result.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ width: '50%' }}>
          <div
            style={{
              padding: 20,
              flexWrap: 'wrap',
              lineHeight: '1.5rem',
              fontSize: 18,
            }}
          >
            {store.topics.map((result, index) => (
              <div key={index} style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 10 }}>{result.distance}</span>
                <p>{result.topic}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})
