import * as React from 'react'
import { view } from '@mcro/black'
import * as PeekBitPanes from './bitPanes'
import { PeekItemResolver } from '../views/PeekItemResolver'
import { capitalize } from 'lodash'
import { App } from '@mcro/stores'
import { PeekPaneProps } from '../PeekPaneProps'
import { OrbitIcon } from '../../../views/OrbitIcon'
// import { PeekRelated } from '../views/PeekRelated'
import { View, SegmentedRow, Searchable, SearchableProps } from '@mcro/ui'
import { PeekBar } from './PeekBar'
import { Bit } from '@mcro/models'
import { DateFormat } from '../../../views/DateFormat'
import { TitleBarButton } from '../views/TitleBarButton'
import { TitleBarSpace } from '../views/TitleBarSpace'
import { Actions } from '../../../actions/Actions'
import { ProvideHighlightsContextWithDefaults } from '../../../helpers/contexts/HighlightsContext'
import { ItemResolverDecorationContext } from '../../../helpers/contexts/ItemResolverDecorationContext'
import { VerticalSpace } from '../../../views'

const SearchablePeek = ({ children, ...props }: SearchableProps) => (
  <Searchable {...props}>{searchableProps => children(searchableProps)}</Searchable>
)

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

export const PeekBit = ({
  appConfig,
  model,
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
  return (
    <ItemResolverDecorationContext.Provider
      value={{
        text: null,
        item: {
          padding: [1, 6],
          '&:hover': {
            background: [0, 0, 0, 0.02],
          },
        },
      }}
    >
      <PeekItemResolver model={model}>
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
                    <SegmentedRow>
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
                        icon="arrowshare91"
                      />
                    </SegmentedRow>
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
                      <View flex={1} />
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
                      <ProvideHighlightsContextWithDefaults value={{ words: [searchTerm] }}>
                        <BitPaneContent
                          bit={bit}
                          peekStore={peekStore}
                          searchTerm={searchTerm}
                          content={content}
                          comments={comments}
                        />
                        <VerticalSpace />
                        <VerticalSpace />
                      </ProvideHighlightsContextWithDefaults>
                    </>
                  ),
                })
              }}
            </SearchablePeek>
          )
        }}
      </PeekItemResolver>
    </ItemResolverDecorationContext.Provider>
  )
}
