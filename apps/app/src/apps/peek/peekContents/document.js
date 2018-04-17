import * as React from 'react'
import { view } from '@mcro/black'
import PeekHeader from '../peekHeader'
import PeekFrame from '../peekFrame'

@view
export class Document {
  render({ bit }) {
    if (!bit) {
      return null
    }
    return (
      <PeekFrame>
        <PeekHeader title={bit.title} />
        <content>
          <bodyContents
            dangerouslySetInnerHTML={{
              __html: (bit.body || '').replace('\n', '<br />'),
            }}
          />
        </content>
      </PeekFrame>
    )
  }

  static style = {
    content: {
      padding: 20,
      overflowY: 'scroll',
      flex: 1,
    },
    bodyContents: {
      whiteSpace: 'pre-line',
      width: '100%',
      overflow: 'hidden',
      fontSize: 16,
      lineHeight: '1.4rem',
    },
  }
}
