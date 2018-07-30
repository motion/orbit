import * as React from 'react'
import * as PeekBitPanes from './bitPanes'
import { PeekItemResolver } from '../views/PeekItemResolver'
import { capitalize } from 'lodash'
import * as UI from '@mcro/ui'
import { HighlightsLayer } from '../../../views/HighlightsLayer'
import { App } from '@mcro/stores'
import { RoundButton } from '../../../views'
import { PeekPaneProps } from '../PeekPaneProps'
import { OrbitIcon } from '../../../views/OrbitIcon'

const SearchablePeek = UI.Searchable(({ children, searchBar, searchTerm }) => {
  return children({
    searchTerm,
    searchBar,
  })
})

export const PeekBit = ({
  item,
  bit,
  appStore,
  searchStore,
  peekStore,
  children,
}: PeekPaneProps) => {
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
      onChange={() => searchStore.setHighlightIndex(0)}
      onEnter={peekStore.goToNextHighlight}
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
              updatedAt,
              comments,
            }) => {
              return children({
                subtitleBefore: (
                  <UI.Text>
                    <UI.Date>{updatedAt}</UI.Date>
                  </UI.Text>
                ),
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
                subtitleAfter: <RoundButton>Open</RoundButton>,
                title,
                titleAfter: !!permalink &&
                  !!icon && (
                    <OrbitIcon onClick={permalink} icon={icon} size={16} />
                  ),
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
