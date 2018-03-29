import * as React from 'react'
import { view } from '@mcro/black'
import { App } from '@mcro/all'
import PeekHeader from '../peekHeader'

@view
export class Document {
  render() {
    const { selectedItem } = App.state
    if (!selectedItem) {
      return null
    }
    return (
      <React.Fragment>
        <PeekHeader title={selectedItem.title} />
        <content
          dangerouslySetInnerHTML={{
            __html: (selectedItem.text || '').replace('\n', '<br />'),
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
