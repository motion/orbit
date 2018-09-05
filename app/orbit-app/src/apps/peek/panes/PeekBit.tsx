import * as React from 'react'
import { view } from '@mcro/black'
import * as PeekBitPanes from './bitPanes'
import { PeekItemResolver } from '../views/PeekItemResolver'
import { capitalize } from 'lodash'
import * as UI from '@mcro/ui'
import { App } from '@mcro/stores'
import { PeekPaneProps } from '../PeekPaneProps'
import { OrbitIcon } from '../../../views/OrbitIcon'
// import { PeekRelated } from '../views/PeekRelated'
import { View } from '@mcro/ui'
import { PeekBar } from './PeekBar'
import { Bit } from '@mcro/models'
import { DateFormat } from '../../../views/DateFormat'
import { TitleBarButton } from '../views/TitleBarButton'
import { TitleBarSpace } from '../views/TitleBarSpace'
import { Actions } from '../../../actions/Actions'
import { HighlightsContext } from '../../../helpers/contexts/HighlightsContext'

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

type PeekItemResolverExtraProps = {
  itemProps?: Object
}

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
              flex: 1,
              // 1px more for inset shadow
              padding: [5, 10, 4, 0],
            }}
            before={<View flex={1} />}
            after={
              <>
                <TitleBarSpace />
                {!!icon && (
                  <UI.ListRow>
                    <TitleBarButton
                      onClick={() => {
                        Actions.open(locationLink)
                        Actions.closeOrbit()
                      }}
                      icon={<OrbitIcon icon={icon} size={16} />}
                      tooltip={location}
                    />
                    <TitleBarButton
                      onClick={() => {
                        Actions.open(desktopLink || webLink)
                        Actions.closeOrbit()
                      }}
                      tooltip="Open"
                      icon="link"
                    />
                  </UI.ListRow>
                )}
              </>
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
                        Actions.open(locationLink)
                      }}
                    >
                      {location}
                    </PeekBar.Button>
                    <PeekBar.Space />
                    {!!updatedAt && (
                      <PeekBar.Text>
                        <DateFormat date={updatedAt} />
                      </PeekBar.Text>
                    )}
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
                    <HighlightsContext.Provider value={searchTerm}>
                      <BitPaneContent
                        bit={bit}
                        appStore={appStore}
                        peekStore={peekStore}
                        searchTerm={searchTerm}
                        content={content}
                        comments={comments}
                      />
                    </HighlightsContext.Provider>
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
