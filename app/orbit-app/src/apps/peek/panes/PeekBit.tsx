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
import { View } from '@mcro/ui'
import { PeekBar } from './PeekBar'
import { Bit } from '@mcro/models'
import { DateFormat } from '../../../views/DateFormat'

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
  background: `linear-gradient(transparent, ${theme.background} 50%)`,
})

const HeadSide = view(View, {
  minWidth: 80,
  padding: [0, 15],
  alignItems: 'center',
  justifyContent: 'center',
})

type PeekItemResolverExtraProps = {
  itemProps?: Object
}

const TitleBarButton = props => (
  <UI.Button
    sizeRadius={0.75}
    sizePadding={1}
    sizeHeight={0.95}
    iconSize={12}
    {...props}
  />
)

export const PeekBit = ({
  appConfig,
  model,
  appStore,
  selectionStore,
  peekStore,
  children,
}: PeekPaneProps) => {
  const bit = model as Bit
  const bitPaneName = capitalize(bit.type)
  const BitPaneContent = PeekBitPanes[bitPaneName]
  if (!BitPaneContent) {
    return <div>Error yo item.subType: {appConfig.subType}</div>
  }
  console.log('peekbit...', bit)
  return (
    <PeekItemResolver
      model={model}
      appStore={appStore}
      {...BitPaneContent.bitResolverProps as PeekItemResolverExtraProps}
    >
      {({
        title,
        icon,
        content,
        location,
        locationLink,
        webLink,
        desktopLink,
        updatedAt,
        comments,
      }) => {
        return (
          <SearchablePeek
            key={appConfig.id}
            defaultValue={App.state.query}
            // focusOnMount
            onChange={() => selectionStore.setHighlightIndex(0)}
            onEnter={peekStore.goToNextHighlight}
            width={200}
            searchBarProps={{
              // 1px more for inset shadow
              padding: [5, 10, 4, 10],
            }}
            before={
              <>
                <HeadSide flex={40} maxWidth="70%" margin={[0, 10, 0, 15]}>
                  <UI.Text fontSize={12.5} fontWeight={500} ellipse>
                    {title}
                  </UI.Text>
                </HeadSide>
                <View flex={1} />
              </>
            }
            after={
              <HeadSide>
                {!!icon && (
                  <UI.ListRow>
                    <TitleBarButton
                      onClick={() => {
                        App.actions.open(locationLink)
                        App.actions.closeOrbit()
                      }}
                      icon={<OrbitIcon icon={icon} size={16} />}
                      tooltip={location}
                    />
                    <TitleBarButton
                      onClick={() => {
                        App.actions.open(desktopLink || webLink)
                        App.actions.closeOrbit()
                      }}
                      tooltip="Open"
                      icon="link"
                    />
                  </UI.ListRow>
                )}
              </HeadSide>
            }
          >
            {({ searchBar, searchTerm }) => {
              return children({
                title: null,
                icon,
                belowHeadMain: searchBar,
                postBody: (
                  <PeekBar>
                    <PeekBar.Button
                      onClick={e => {
                        e.stopPropagation()
                        App.actions.open(locationLink)
                      }}
                    >
                      {location}
                    </PeekBar.Button>
                    <PeekBar.Space />
                    <PeekBar.Text>
                      <DateFormat>{updatedAt}</DateFormat>
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
