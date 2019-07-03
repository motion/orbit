import { save } from '@o/bridge'
import { AppIcon, PaneManagerPane, useActiveAppsSorted, useStore } from '@o/kit'
import { AppModel } from '@o/models'
import { SortableContainer, SortableElement } from '@o/react-sortable-hoc'
import { App } from '@o/stores'
import { isRightClick, Space } from '@o/ui'
import { Box, gloss, Row, RowProps } from 'gloss'
import { flow } from 'lodash'
import React, { forwardRef, memo, useMemo } from 'react'

import { getAppContextItems } from '../../helpers/getAppContextItems'
import { preventDefault } from '../../helpers/preventDefault'
import { useAppSortHandler } from '../../hooks/useAppSortHandler'
import { useOm } from '../../om/om'
import { useNewAppStore, usePaneManagerStore } from '../../om/stores'
import { OrbitTab, OrbitTabButton, tabHeight, TabProps } from '../../views/OrbitTab'
import { appsCarouselStore } from './OrbitAppsCarousel'

const isOnSettings = (pane?: PaneManagerPane) =>
  (pane && pane.type === 'sources') || pane.type === 'spaces' || pane.type === 'settings'

const pinWidth = 52

export const OrbitNav = memo(
  forwardRef((_: any, ref) => {
    const paneManagerStore = usePaneManagerStore()
    const { isEditing } = useStore(App)
    const { state, actions } = useOm()
    const isOnSetupApp = state.router.isOnSetupApp
    const { panes, paneId } = paneManagerStore
    // in case they get in a weird state, filter
    const allActiveApps = useActiveAppsSorted()
    const activeAppsSorted = useMemo(
      () => allActiveApps.filter(x => panes.some(pane => pane.id === `${x.id}`)),
      [allActiveApps],
    )
    const handleSortEnd = useAppSortHandler()

    if (isEditing) {
      return null
    }

    const tabWidth = 54
    const tabWidthPinned = 66

    const items = useMemo(
      () =>
        activeAppsSorted
          .map(
            (app): TabProps => {
              const isActive = !isOnSetupApp && `${app.id}` === paneId
              // const next = activeAppsSorted[index + 1]
              // const isLast = index === activeAppsSorted.length
              // const nextIsActive = next && paneManagerStore.activePane.id === `${next.id}`
              const isPinned = app.tabDisplay === 'pinned' || app.tabDisplay === 'permanent'
              return {
                app,
                width: isPinned ? tabWidthPinned : tabWidth,
                tabDisplay: app.tabDisplay,
                isActive,
                icon: <AppIcon identifier={app.identifier} colors={app.colors} />,
                iconSize: tabHeight - 6,
                getContext() {
                  return [
                    {
                      label: 'Open...',
                    },
                    {
                      label: 'App settings',
                      checked: true,
                    },
                    {
                      type: 'separator',
                    },
                    {
                      label: isPinned ? 'Unpin' : 'Pin',
                      click() {
                        save(AppModel, {
                          ...app,
                          tabDisplay: app.tabDisplay === 'pinned' ? 'plain' : 'pinned',
                        })
                      },
                    },
                    ...getAppContextItems(app),
                  ]
                },
                onClick: () => {
                  appsCarouselStore.shouldZoomIn()
                  actions.router.showAppPage({ id: `${app.id}` })
                },
              }
            },
          )
          .filter(x => !!x),
      [activeAppsSorted, isOnSetupApp],
    )

    const onSettings = isOnSettings(paneManagerStore.activePane)
    const setupWidth = 120
    const isOnSetupAppWidth = isOnSetupApp ? setupWidth : tabWidthPinned
    const extraButtonsWidth = isOnSetupAppWidth

    const permanentItems = items.filter(x => x.tabDisplay === 'permanent')
    const pinnedItems = items.filter(x => x.tabDisplay === 'pinned')
    const plainItems = items.filter(x => x.tabDisplay === 'plain')

    const pinnedItemsWidth = pinWidth * (pinnedItems.length + permanentItems.length)

    const epad = 3
    const sidePad = 26 // corresponds to OrbitNavClip side padding
    const maxWidth = pinnedItemsWidth + extraButtonsWidth + sidePad

    return (
      <OrbitNavClip ref={ref}>
        <OrbitNavChrome>
          <Row
            transition="opacity ease 300ms"
            height={tabHeight + 10}
            padding={5}
            margin={-5}
            overflow="hidden"
            flex={1}
            opacity={onSettings ? 0.5 : 1}
          >
            {permanentItems.map(props => (
              <OrbitTab key={props.app.id} {...props} />
            ))}
            {/* Pinned tabs */}
            <SortableTabs
              className="hide-scrollbars"
              axis="x"
              lockAxis="x"
              distance={8}
              items={pinnedItems}
              shouldCancelStart={isRightClick}
              onSortEnd={handleSortEnd}
              height={tabHeight + 20}
              overflowX="auto"
              overflowY="hidden"
            />
            <SortableTabs
              className="hide-scrollbars"
              axis="x"
              lockAxis="x"
              distance={8}
              maxWidth={`calc(100% - ${maxWidth}px)`}
              items={plainItems}
              shouldCancelStart={isRightClick}
              onSortEnd={handleSortEnd}
              height={tabHeight + 20}
              overflowX="auto"
              overflowY="hidden"
            />
            <Space size={epad} />
            {isOnSetupApp && <OrbitNewAppTab width={setupWidth} />}
            {!isOnSetupApp && (
              <OrbitTab
                tooltip={isOnSetupApp ? 'Cancel' : 'Add'}
                width={tabWidthPinned}
                icon={isOnSetupApp ? 'remove' : 'add'}
                onClick={actions.router.toggleSetupAppPage}
              />
            )}
          </Row>
        </OrbitNavChrome>
      </OrbitNavClip>
    )
  }),
)

const OrbitNewAppTab = props => {
  const newAppStore = useNewAppStore()
  const { actions } = useOm()
  return (
    <OrbitTab
      stretch
      iconSize={18}
      icon={<AppIcon identifier={newAppStore.app.identifier} colors={newAppStore.app.colors} />}
      isActive
      label={'New app'}
      after={
        <OrbitTabButton
          icon="cross"
          onClick={flow(
            preventDefault,
            actions.router.back,
          )}
        />
      }
      {...props}
    />
  )
}

const OrbitNavClip = gloss(Box, {
  padding: [20, 20],
  margin: [-20, 0],
})

const OrbitNavChrome = gloss(Box, {
  maxWidth: '100%',
  pointerEvents: 'inherit',
  height: tabHeight,
  flexFlow: 'row',
  position: 'relative',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  margin: [0, 'auto'],
})

const SortableTab = SortableElement((props: TabProps) => {
  return <OrbitTab {...props} />
})

type SortableTabsProps = RowProps & { items: TabProps[] }

const SortableTabs = SortableContainer(({ items, ...restProps }: SortableTabsProps) => {
  return (
    <Row {...restProps}>
      {items.map((item, index) => (
        <SortableTab {...item} key={index} index={index} />
      ))}
    </Row>
  )
})
