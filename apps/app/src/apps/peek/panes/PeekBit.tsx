import * as React from 'react'
import { view } from '@mcro/black'
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

const Meta = view({
  padding: 10,
  borderBottom: [1, '#eee'],
  flexFlow: 'row',
  overflow: 'hidden',
  alignItems: 'center',
})

const HorizontalSpace = view({
  width: 15,
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
      placeholder={`Search this ${item.subType} and related...`}
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
              integration,
              permalink,
              updatedAt,
              comments,
            }) => {
              return children({
                title,
                icon,
                subhead: searchBar,
                content: (
                  <>
                    <Meta>
                      <UI.Theme name="grey">
                        <RoundButton
                          onClick={e => {
                            e.stopPropagation()
                            locationLink()
                          }}
                        >
                          {location}
                        </RoundButton>
                      </UI.Theme>
                      <UI.View flex={1} />
                      <UI.Text>
                        <UI.Date>{updatedAt}</UI.Date>
                      </UI.Text>
                      {!!permalink &&
                        !!icon && (
                          <>
                            <HorizontalSpace />
                            <OrbitIcon
                              onClick={() => {
                                console.log(
                                  'todo open integration',
                                  integration,
                                )
                              }}
                              icon={icon}
                              size={16}
                            />
                          </>
                        )}
                      <HorizontalSpace />
                      <UI.Theme name="orbit">
                        <RoundButton onClick={permalink}>Open</RoundButton>
                      </UI.Theme>
                    </Meta>
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
                  </>
                ),
              })
            }}
          </PeekItemResolver>
        )
      }}
    </SearchablePeek>
  )
}
