import * as React from 'react'
import { view } from '@mcro/black'
import { PeekBitResolver, PeekHeader, PeekContent } from '../index'
import markdown from 'marky-markdown'

const options = {
  language: 'english',
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: false,
}

@view
export class Document extends React.Component {
  render({ bit, appStore, children }) {
    if (!bit || !bit.data) {
      return children({})
    }
    let bodyContents
    if (bit.data.markdownBody) {
      bodyContents = markdown(bit.data.markdownBody, options)
    } else {
      bodyContents = bit.data.htmlBody || ''
    }
    return (
      <PeekBitResolver bit={bit} appStore={appStore}>
        {({ title, icon }) => {
          return children({
            title,
            icon,
            content: (
              <bodyContents
                className="markdown"
                dangerouslySetInnerHTML={{
                  __html: bodyContents,
                }}
              />
            ),
          })
        }}
      </PeekBitResolver>
    )
  }

  static style = {
    bodyContents: {
      whiteSpace: 'pre-line',
      width: '100%',
      overflow: 'hidden',
      padding: [0, 10],
    },
  }
}
