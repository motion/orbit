import * as React from 'react'
import { view } from '@mcro/black'
import { PeekHeader } from '../peekHeader'

@view
export class Document {
  render({ bit }) {
    if (!bit) {
      return null
    }
    return (
      <React.Fragment>
        <PeekHeader title={bit.title} />
        <content>
          <bodyContents
            dangerouslySetInnerHTML={{
              __html: (bit.body || '').replace('\n', '<br />'),
            }}
          />
        </content>
      </React.Fragment>
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
