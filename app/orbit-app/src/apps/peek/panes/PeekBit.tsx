import * as React from 'react'
import { view } from '@mcro/black'
import * as PeekBitPanes from './bitPanes'
import { PeekItemResolver } from '../views/PeekItemResolver'
import { capitalize } from 'lodash'
import * as UI from '@mcro/ui'
import { HighlightsLayer } from '../../../views/HighlightsLayer'
import { App } from '@mcro/stores'
import { PeekPaneProps } from '../PeekPaneProps'
import { OrbitIcon } from '../../../views/OrbitIcon'
// import { PeekRelated } from '../views/PeekRelated'
import { TimeAgo } from '../../../views/TimeAgo'
import { View } from '@mcro/ui'
import { PeekBar } from './PeekBar'

const SearchablePeek = UI.Searchable(({ children, searchBar, searchTerm }) => {
  return children({
    searchTerm,
    searchBar,
  })
})

const Cmd = view({
  opacity: 0.6,
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

const HeadSide = view({
  width: 80,
  alignItems: 'center',
  justifyContent: 'center',
})

export const PeekBit = ({
  item,
  bit,
  appStore,
  selectionStore,
  peekStore,
  children,
}: PeekPaneProps) => {
  const bitPaneName = capitalize(item.subType)
  const BitPaneContent = PeekBitPanes[bitPaneName]
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
        return (
          <SearchablePeek
            key={item.id}
            defaultValue={App.state.query}
            // focusOnMount
            onChange={() => selectionStore.setHighlightIndex(0)}
            onEnter={peekStore.goToNextHighlight}
            placeholder={`Search this ${item.subType} and related...`}
            searchBarProps={{
              padding: [5, 10],
              height: 42,
            }}
            before={
              <HeadSide>
                {!!icon && (
                  <UI.Button
                    onClick={() => {
                      console.log('todo open integration', integration)
                    }}
                    circular
                    icon={<OrbitIcon icon={icon} size={16} />}
                  />
                )}
              </HeadSide>
            }
            after={
              <HeadSide>
                {!!icon && (
                  <UI.Button
                    onClick={permalink}
                    circular
                    icon="link"
                    iconSize={14}
                  />
                )}
              </HeadSide>
            }
          >
            {({ searchBar, searchTerm }) => {
              return children({
                title,
                icon,
                belowHeadMain: searchBar,
                postBody: (
                  <PeekBar>
                    <PeekBar.Button
                      onClick={e => {
                        e.stopPropagation()
                        locationLink()
                      }}
                    >
                      {location}
                    </PeekBar.Button>
                    <PeekBar.Space />
                    <PeekBar.Text>
                      <TimeAgo>{updatedAt}</TimeAgo>
                    </PeekBar.Text>
                    <UI.View flex={1} />
                    <PeekBar.Section>
                      <PeekBar.Button onClick={peekStore.copyItem}>
                        Copy Link <Cmd>⌘+Shift+C</Cmd>
                      </PeekBar.Button>
                      <View width={5} />
                      <PeekBar.Button onClick={peekStore.openItem}>
                        Open <Cmd>⌘+Enter</Cmd>
                      </PeekBar.Button>
                    </PeekBar.Section>
                  </PeekBar>
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
                    {/* height for bottom bar */}
                    <div style={{ height: 80 }} />
                    {/* <BottomSpace />
                    <BottomFloat>
                      <PeekRelated
                        padding={[0, 15]}
                        cardSpace={10}
                        verticalPadding={10}
                      />
                    </BottomFloat> */}
                  </>
                ),
              })
            }}
          </SearchablePeek>
        )
      }}
    </PeekItemResolver>
  )
}
