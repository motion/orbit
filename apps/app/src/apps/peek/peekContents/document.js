import * as React from 'react'
import { view } from '@mcro/black'
import { PeekBitResolver } from '../index'
import markdown from '@mcro/marky-markdown'

const options = {
  language: 'english',
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: false,
}

const BodyContents = view({
  whiteSpace: 'pre-line',
  width: '100%',
  overflow: 'hidden',
  padding: [0, 10],
})

@view
export class Document extends React.Component {
  render({ bit, appStore, children }) {
    if (!bit || !bit.data) {
      return children({})
    }
    return (
      <PeekBitResolver bit={bit} appStore={appStore}>
        {({ title, icon, content }) => {
          let bodyContents = content
          if (bit.data.markdownBody) {
            bodyContents = markdown(content, options)
          }
          return children({
            title,
            icon,
            content: (
              <BodyContents
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
}
