import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

// this static style should override the grandparent dynamic
// ... looks like it does! :)
const Test = view({
  background: 'blue',
  height: 100,
  width: 100,
  big: {
    background: 'pink',
  },
})

// extend and test
const Test2 = view(Test, {
  background: 'red',
  big: {
    background: 'yellow',
    '&:hover': {
      background: 'green',
    },
  },
})

export const Root = () => {
  return (
    <div css={{ pointerEvents: 'all' }}>
      <Test>blue</Test>
      <Test big>pink</Test>
      <Test2>red</Test2>
      <Test2 big>yellow</Test2>
    </div>
  )
}
