import * as React from 'react'
import { view } from '@mcro/black'
import PeekHeader from '../peekHeader'

@view
export class Document {
  render({ item }) {
    if (!item) {
      return null
    }
    return (
      <React.Fragment>
        <PeekHeader title={item.title} />
        <content
          dangerouslySetInnerHTML={{
            __html: (item.text || '').replace('\n', '<br />'),
          }}
        />
      </React.Fragment>
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
