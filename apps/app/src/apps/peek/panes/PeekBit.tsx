import * as React from 'react'
import * as PeekBitPanes from './bitPanes'
import { PeekItemResolver } from '../views/PeekItemResolver'
import { capitalize } from 'lodash'
import * as UI from '@mcro/ui'
import { HighlightsLayer } from '../../../views/HighlightsLayer'
import { App } from '@mcro/stores'
import { RoundButton } from '../../../views'

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
    <SearchablePeek
      key={item.id}
      defaultValue={App.state.query}
      focusOnMount
      searchBarTheme={peekStore.theme}
    >
      {({ searchBar, searchTerm }) => {
        return (
          <PeekItemResolver
            item={item}
            bit={bit}
            appStore={appStore}
            searchTerm={searchTerm}
            {...BitPaneContent.bitResolverProps}
          >
            {({
              title,
              icon,
              content,
              location,
              locationLink,
              permalink,
              date,
              comments,
            }) => {
              return children({
                permalink,
                subtitle: (
                  <RoundButton
                    onClick={e => {
                      e.stopPropagation()
                      locationLink()
                    }}
                  >
                    {location}
                  </RoundButton>
                ),
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
          </PeekItemResolver>
        )
      }}
    </SearchablePeek>
  )
}
