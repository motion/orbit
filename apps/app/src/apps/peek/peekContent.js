// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class PeekContent {
  render({ store, target }) {
    console.log('target is', target)
    if (!target) return <div />
    const { result } = target
    return (
      <content>
        <doc if={result}>
          <UI.Title size={1.2}>{result.document.title}</UI.Title>
          <UI.Text $sentence size={0.9}>
            {result.sentence}
          </UI.Text>
        </doc>
      </content>
    )
  }

  static style = {
    content: {
      margin: 15,
    },
    sentence: {
      marginTop: 15,
    },
  }
}
