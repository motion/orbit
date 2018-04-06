import * as React from 'react'
import { view } from '@mcro/black'
import PeekHeader from '../peekHeader'
import PeekFrame from '../peekFrame'

@view
export class Document {
  render({ item }) {
    if (!item) {
      return null
    }
    return (
      <PeekFrame>
        <PeekHeader title={item.title} />
        <content
          dangerouslySetInnerHTML={{
            __html: (item.text || '').replace('\n', '<br />'),
          }}
        />
      </PeekFrame>
    )
  }

  static style = {
    content: {
      padding: 20,
      overflowY: 'scroll',
      flex: 1,
    },
  }
}
