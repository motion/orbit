import * as React from 'react'
import { view } from '@mcro/black'
import * as PeekBitPanes from './bitPanes'
import { PeekItemResolver } from '../views/PeekItemResolver'
import { capitalize } from 'lodash'
import * as UI from '@mcro/ui'
import { HighlightsLayer } from '../../../views/HighlightsLayer'
import { App } from '@mcro/stores'
import { RoundButton, SubTitle } from '../../../views'
import { PeekPaneProps } from '../PeekPaneProps'
import { OrbitIcon } from '../../../views/OrbitIcon'
import { PeekRelated } from '../views/PeekRelated'
import { TimeAgo } from '../../../views/TimeAgo'

const SearchablePeek = UI.Searchable(({ children, searchBar, searchTerm }) => {
  return children({
    searchTerm,
    searchBar,
  })
})

const PeekBottom = view({
  background: '#fff',
  margin: [0, -30],
  padding: [0, 30],
  borderTop: [1, '#eee'],
  position: 'relative',
  zIndex: 10,
})

const PeekActionBar = view({
  padding: [6, 10, 8],
  flexFlow: 'row',
  overflow: 'hidden',
  alignItems: 'center',
})

const Cmd = view({
  opacity: 0.5,
})

const HorizontalSpace = view({
  width: 10,
})

const BottomSpace = view({
  height: 100,
})

const extra = 50
const BottomFloat = view({
  height: 132 + extra,
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  paddingTop: 50 + extra,
  pointerEvents: 'none',
  '& > *': {
    pointerEvents: 'auto',
  },
})

BottomFloat.theme = ({ theme }) => ({
  background: `linear-gradient(transparent, ${theme.base.background} 50%)`,
})

const searchBarProps = {
  padding: [7, 50],
  height: 48,
}

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
      searchBarProps={searchBarProps}
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
                postBody: (
                  <PeekBottom>
                    <PeekActionBar>
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
                      <HorizontalSpace />
                      <UI.Text>
                        <TimeAgo>{updatedAt}</TimeAgo>
                      </UI.Text>
                      <div />
                      <UI.View flex={1} />
                      <UI.Row alignItems="center">
                        {!!permalink &&
                          !!icon && (
                            <>
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
                              <HorizontalSpace />
                            </>
                          )}
                        <RoundButton alignItems="center">
                          Copy Link <Cmd>⌘+Shift+C</Cmd>
                        </RoundButton>
                        <HorizontalSpace />
                        <UI.Theme name="orbit">
                          <RoundButton alignItems="center">
                            Open <Cmd>⌘+Enter</Cmd>
                          </RoundButton>
                        </UI.Theme>
                      </UI.Row>
                    </PeekActionBar>
                  </PeekBottom>
                ),
                content: (
                  <>
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
                    <BottomSpace />
                    <BottomFloat>
                      <PeekRelated
                        padding={[0, 15]}
                        cardSpace={10}
                        verticalPadding={10}
                      />
                    </BottomFloat>
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
