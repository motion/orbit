import * as React from 'react'
import { view } from '@mcro/black'
import { PeekBitResolver } from '../index'
import markdown from '@mcro/marky-markdown'
import { PeekContentProps } from './PeekContentProps'
import * as UI from '@mcro/ui'

const options = {
  language: 'english',
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: false,
}

const BodyContents = view({
  whiteSpace: 'pre-line',
  width: '100%',
  flex: 1,
  overflowX: 'hidden',
  overflowY: 'scroll',
  padding: 20,
  fontSize: 18,
  lineHeight: 26,
})

const SearchableDocument = UI.Searchable(({ children, searchTerm }) => {
  return (
    <BodyContents
      className="markdown"
      dangerouslySetInnerHTML={{
        __html: children,
      }}
    />
  )
})

@view
export class Document extends React.Component<PeekContentProps> {
  render() {
    const { bit, appStore, peekStore, children } = this.props
    if (!bit || !bit.data) {
      return children({})
    }
    return (
      <PeekBitResolver bit={bit} appStore={appStore}>
        {({ title, icon, content }) => {
          return children({
            title,
            icon,
            content: (
              <UI.Theme theme={peekStore.theme}>
                <SearchableDocument>
                  {typeof content === 'string'
                    ? markdown(content, options)
                    : content}
                </SearchableDocument>
              </UI.Theme>
            ),
          })
        }}
      </PeekBitResolver>
    )
  }
}
