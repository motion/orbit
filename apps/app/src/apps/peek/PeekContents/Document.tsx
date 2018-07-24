import * as React from 'react'
import { PeekBitResolver } from '../index'
import { PeekContentProps } from './PeekContentProps'
import * as UI from '@mcro/ui'
import { MarkdownBody } from './views/MarkdownBody'

const SearchableDocument = UI.Searchable(
  ({ content, children, searchBar, searchTerm }) => {
    return children({
      searchBar,
      content: <MarkdownBody>{content}</MarkdownBody>,
    })
  },
)

export const Document = ({
  bit,
  appStore,
  peekStore,
  children,
}: PeekContentProps) => {
  if (!bit || !bit.data) {
    return children({})
  }
  return (
    <PeekBitResolver bit={bit} appStore={appStore}>
      {({ title, icon, content, location, permalink, date }) => {
        return (
          <SearchableDocument
            content={content}
            searchBarTheme={peekStore.theme}
          >
            {({ content, searchBar }) => {
              return children({
                permalink,
                subtitle: location,
                date,
                title,
                icon,
                subhead: searchBar,
                content,
              })
            }}
          </SearchableDocument>
        )
      }}
    </PeekBitResolver>
  )
}
