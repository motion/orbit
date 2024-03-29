import { save } from '@o/bridge'
import { AppIcon, useActiveAppsSorted, useStore } from '@o/kit'
import { AppBit, AppModel } from '@o/models'
import { SortableContainer, SortableContainerProps, SortableElement } from '@o/react-sortable-hoc'
import { App } from '@o/stores'
import { isRightClick, Space, Stack, StackProps, useMemoList } from '@o/ui'
import { Box, gloss } from 'gloss'
import React, { forwardRef, memo, useEffect, useMemo, useRef } from 'react'

import { getAppContextItems } from '../../helpers/getAppContextItems'
import { useAppSortHandler } from '../../hooks/useAppSortHandler'
import { useOm } from '../../om/om'
import { usePaneManagerStore } from '../../om/stores'
import { OrbitTab, tabHeight, TabProps } from '../../views/OrbitTab'
import { appsCarouselStore } from './OrbitAppsCarouselStore'
import { useHeaderStore } from './OrbitHeaderStore'

const isOnSettings = (app?: AppBit) =>
  app &&
  (app.identifier === 'sources' || app.identifier === 'spaces' || app.identifier === 'settings')

const pinWidth = 52

export const OrbitNav = memo(
  forwardRef(function OrbitNav(_: any, ref) {
    const allActiveApps = useActiveAppsSorted()
    const paneManagerStore = usePaneManagerStore()
    const headerStore = useHeaderStore()
    const focusedApp = headerStore.paneState.focusedApp
    // use Slow this view doesnt need update quickly
    const { isEditing } = useStore(App)
    const { state, actions } = useOm()
    const { panes } = paneManagerStore
    // in case they get in a weird state, filter
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

    const items = useMemoList(
      activeAppsSorted,
      app => [app, app.id === focusedApp.id],
      app => {
        const isActive = app.id === focusedApp.id
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

    const onSettings = isOnSettings(focusedApp)
    const isOnSetupAppWidth = tabWidthPinned
    const extraButtonsWidth = isOnSetupAppWidth

    const permanentItems = items.filter(x => x.tabDisplay === 'permanent')
    const pinnedItems = items.filter(x => x.tabDisplay === 'pinned')
    const plainItems = items.filter(x => x.tabDisplay === 'plain')

    const pinnedItemsWidth = pinWidth * (pinnedItems.length + permanentItems.length)

    const epad = 3
    const maxWidth = pinnedItemsWidth + extraButtonsWidth

    return (
      <OrbitNavChrome nodeRef={ref}>
        <Stack
          direction="horizontal"
          transition="opacity ease 300ms"
          padding={5}
          margin={-5}
          overflow="hidden"
          flex={1}
          opacity={onSettings ? 0.5 : 1}
        >
          {permanentItems.map(props => (
            <OrbitTab key={props.app!.id} {...props} />
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
            height={tabHeight}
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
            height={tabHeight}
            overflowX="auto"
            overflowY="hidden"
          />
          <Space size={epad} />
          <OrbitTab
            tooltip="Add app"
            width={tabWidthPinned}
            icon="Add"
            onClick={actions.router.toggleSetupAppPage}
            isActive={state.router.isOnSetupApp}
          />
        </Stack>
      </OrbitNavChrome>
    )
  }),
)

const OrbitNavChrome = gloss(Box, {
  maxWidth: '100%',
  pointerEvents: 'inherit',
  flexDirection: 'row',
  position: 'relative',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  margin: [0, 'auto'],
  padding: [4, 20],
})

const SortableTab = SortableElement((props: TabProps) => {
  return <OrbitTab {...props} />
})

type SortableTabsProps = StackProps & { items: TabProps[] }

const SortableTabsContainer = SortableContainer(({ items, ...restProps }: SortableTabsProps) => {
  return (
    <Stack direction="horizontal" {...restProps}>
      {items.map((item, index) => (
        <SortableTab {...item} key={index} index={index} />
      ))}
    </Stack>
  )
})

function SortableTabs(props: SortableTabsProps & SortableContainerProps) {
  return <SortableTabsContainer helperClass="sortableHelper" {...props} />
}
