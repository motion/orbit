import * as React from 'react'
import { view } from '@mcro/black'
import { PeekBitResolver } from '../index'
import markdown from '@mcro/marky-markdown'
import { PeekContentProps } from './PeekContentProps'

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
  padding: 20,
  fontSize: 22,
  lineHeight: '2rem',
})

@view
export class Document extends React.Component<PeekContentProps> {
  render() {
    const { bit, appStore, children } = this.props
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
