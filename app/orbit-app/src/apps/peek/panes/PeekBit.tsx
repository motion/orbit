import * as React from 'react'
import { view } from '@mcro/black'
import * as PeekBitPanes from './bitPanes'
import { PeekItemResolver } from '../views/PeekItemResolver'
import { capitalize } from 'lodash'
import { App } from '@mcro/stores'
import { PeekPaneProps } from '../PeekPaneProps'
import { OrbitIcon } from '../../../views/OrbitIcon'
import { View, SegmentedRow, Searchable } from '@mcro/ui'
import { PeekBar } from './PeekBar'
import { Bit } from '@mcro/models'
import { DateFormat } from '../../../views/DateFormat'
import { TitleBarButton } from '../views/TitleBarButton'
import { TitleBarSpace } from '../views/TitleBarSpace'
import { Actions } from '../../../actions/Actions'
import { ProvideHighlightsContextWithDefaults } from '../../../helpers/contexts/HighlightsContext'
import { ItemResolverDecorationContext } from '../../../helpers/contexts/ItemResolverDecorationContext'
import { VerticalSpace } from '../../../views'

const Cmd = view({
  opacity: 0.6,
})

export const PeekBit = ({
  appConfig,
  model,
  selectionStore,
  peekStore,
  children,
}: PeekPaneProps<Bit>) => {
  const bitPaneName = capitalize(model.type)
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
            <Searchable
              key={appConfig.id}
              defaultValue={App.state.query}
              // focusOnMount
              // onEnter={peekStore.goToNextHighlight}
              onChange={() => selectionStore.setHighlightIndex(0)}
              width={200}
              searchBarProps={{
                flex: 1,
                // 1px more for inset shadow
                padding: [5, 10, 4, 0],
              }}
            >
              {({ searchBar, searchTerm }) => {
                return children({
                  headerProps: {
                    before: title,
                    after: (
                      <>
                        {searchBar}
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
                    ),
                  },
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
                          bit={model}
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
            </Searchable>
          )
        }}
      </PeekItemResolver>
    </ItemResolverDecorationContext.Provider>
  )
}
