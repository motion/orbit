import * as React from 'react'
import * as PeekBitPanes from './bitPanes'
import { PeekItemResolver } from '../views/PeekItemResolver'
import { capitalize } from 'lodash'
import * as UI from '@mcro/ui'
import { HighlightsLayer } from '../../../views/HighlightsLayer'

const SearchablePeek = UI.Searchable(({ children, searchBar, searchTerm }) => {
  return children({
    searchTerm,
    searchBar,
  })
})

export const PeekBit = ({ item, bit, appStore, peekStore, children }) => {
  const BitPaneContent = PeekBitPanes[capitalize(item.subType)]
  if (!BitPaneContent) {
    return <div>Error yo item.subType: {item.subType}</div>
  }
  return (
    <PeekItemResolver
      item={item}
      bit={bit}
      appStore={appStore}
      {...BitPaneContent.bitResolverProps}
    >
      {({ title, icon, content, location, permalink, date, comments }) => {
        return (
          <SearchablePeek focusOnMount searchBarTheme={peekStore.theme}>
            {({ searchBar, searchTerm }) => {
              return children({
                permalink,
                subtitle: location,
                date,
                title,
                icon,
                subhead: searchBar,
                content: (
                  <HighlightsLayer term={searchTerm}>
                    <BitPaneContent
                      bit={bit}
                      appStore={appStore}
                      peekStore={peekStore}
                      searchTerm={searchTerm}
                      content={content}
                      comments={comments}
                    />
                  </HighlightsLayer>
                ),
              })
            }}
          </SearchablePeek>
        )
      }}
    </PeekItemResolver>
  )
}
