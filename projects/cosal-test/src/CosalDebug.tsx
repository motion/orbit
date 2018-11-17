import * as React from 'react'
import { react, compose, view, attach } from '@mcro/black'

class CosalStore {
  query = 'hello world'

  hi = react(
    async () => {
      return await fetch(`http://localhost:4444/weights?query=${this.query}`).then(res =>
        res.json(),
      )
    },
    {
      defaultValue: 'no',
    },
  )
}

const decorate = compose(
  attach({
    store: CosalStore,
  }),
  view,
)
export const CosalDebug = decorate(({ store }) => {
  return (
    <div>
      what {typeof store.hi} {JSON.stringify(store.hi)}
    </div>
  )
})
