import * as React from 'react'
import * as PeekBitPanes from './bitPanes'
import { PeekBitResolver } from '../views/PeekBitResolver'
import { capitalize } from 'lodash'
import * as UI from '@mcro/ui'

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
    <PeekBitResolver item={item} bit={bit} appStore={appStore}>
      {({ title, icon, content, location, permalink, date }) => {
        return (
          <SearchablePeek searchBarTheme={peekStore.theme}>
            {({ searchBar, searchTerm }) => {
              return children({
                permalink,
                subtitle: location,
                date,
                title,
                icon,
                subhead: searchBar,
                content: (
                  <BitPaneContent
                    bit={bit}
                    appStore={appStore}
                    peekStore={peekStore}
                    searchTerm={searchTerm}
                    content={content}
                  />
                ),
              })
            }}
          </SearchablePeek>
        )
      }}
    </PeekBitResolver>
  )
}
