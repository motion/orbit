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
// import { PeekRelated } from '../views/PeekRelated'
import { TimeAgo } from '../../../views/TimeAgo'
import { PeekBottom } from './PeekBottom'
import { PeekActionBar } from './PeekActionBar'
import { View } from '@mcro/ui'

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
            focusOnMount
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
                  <PeekBottom>
                    <PeekActionBar>
                      <RoundButton
                        onClick={e => {
                          e.stopPropagation()
                          locationLink()
                        }}
                      >
                        {location}
                      </RoundButton>
                      <PeekActionBar.Space />
                      <UI.Text>
                        <TimeAgo>{updatedAt}</TimeAgo>
                      </UI.Text>
                      <div />
                      <UI.View flex={1} />
                      <UI.Row alignItems="center">
                        <RoundButton
                          onClick={peekStore.copyItem}
                          alignItems="center"
                        >
                          Copy Link <Cmd>⌘+Shift+C</Cmd>
                        </RoundButton>
                        <View width={5} />
                        <RoundButton
                          onClick={peekStore.openItem}
                          alignItems="center"
                        >
                          Open <Cmd>⌘+Enter</Cmd>
                        </RoundButton>
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
