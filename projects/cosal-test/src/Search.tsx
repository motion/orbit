import * as React from 'react'
import { react, compose, view, attach, ensure } from '@mcro/black'

class SearchStore {
  query = 'i love elon'

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
}

const decorate = compose(
  attach({
    store: SearchStore,
  }),
  view,
)
export const Search = decorate(({ store }) => {
  return (
    <div style={{ padding: 50 }}>
      <input
        style={{ width: 200, fontSize: 20 }}
        onChange={e => (store.query = e.target.value)}
        value={store.query}
      />
      <div
        style={{
          padding: 20,
          flexWrap: 'wrap',
          lineHeight: '1.5rem',
          fontSize: 18,
        }}
      >
        {store.results.map((result, index) => (
          <div key={index} style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 10 }}>{result.distance}</span>
            <p>{result.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
})
