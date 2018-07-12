import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

// this static style should override the grandparent dynamic
// ... looks like it does! :)
const Test = view(UI.Col, {
  height: '50%',
})

export const Root = () => {
  return <Test fill>test me</Test>
}
