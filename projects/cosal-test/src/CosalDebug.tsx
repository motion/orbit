import * as React from 'react'
import { react, compose, view, attach, ensure } from '@mcro/black'

class SearchStore {
  query = 'hello world'

  results = react(
    async () => {
      const res = await fetch(`http://localhost:4444/weights?query=${this.query}`).then(res =>
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
export const CosalDebug = decorate(({ store }) => {
  return (
    <div style={{ padding: 50 }}>
      <input onChange={e => (store.query = e.target.value)} />
      <div
        style={{
          padding: 20,
          flexWrap: 'wrap',
          lineHeight: '3rem',
          fontSize: 18,
        }}
      >
        {store.results.map((result, index) => (
          <div key={index}>{JSON.stringify(result)}</div>
        ))}
      </div>
    </div>
  )
})
