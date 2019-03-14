import { save } from '@o/bridge'
import { gloss, Row, ViewProps } from '@o/gloss'
import { PaneManagerPane, useActiveAppsSorted, useActiveSpace } from '@o/kit'
import { useAppSortHandler } from '@o/kit-internal'
import { AppModel } from '@o/models'
import { SortableContainer, SortableElement } from '@o/react-sortable-hoc'
import { isRightClick } from '@o/ui'
import { ensure, react, useHook, useStore } from '@o/use-store'
import { flow } from 'lodash'
import React, { memo } from 'react'
import { OrbitTab, OrbitTabButton, tabHeight, TabProps } from '../../components/OrbitTab'
import { getAppContextItems } from '../../helpers/getAppContextItems'
import { preventDefault } from '../../helpers/preventDefault'
import { useActions } from '../../hooks/useActions'
import { useStores, useStoresSimple } from '../../hooks/useStores'

const isOnSettings = (pane?: PaneManagerPane) =>
  (pane && pane.type === 'sources') || pane.type === 'spaces' || pane.type === 'settings'

class OrbitNavStore {
  stores = useHook(useStoresSimple)

  previousTabID = react(
    () => this.stores.paneManagerStore.activePane,
    pane => {
      ensure('not on settings', !isOnSettings(pane))
      return pane.id
    },
    {
      log: false,
    },
  )
}

export const OrbitNav = memo(() => {
  const { orbitStore, spaceStore, paneManagerStore, newAppStore } = useStores()
  const Actions = useActions()
  const store = useStore(OrbitNavStore)
  const { showCreateNew } = newAppStore
  const activeSpaceName = spaceStore.activeSpace.name
  const activeAppsSorted = useActiveAppsSorted()
  const { activePaneId } = paneManagerStore
  const [space] = useActiveSpace()
  const handleSortEnd = useAppSortHandler()

  if (orbitStore.isTorn) {
    return null
  }

  // after hooks

  if (!activeAppsSorted.length || !space || !space.paneSort) {
    return (
      <OrbitNavClip>
        <OrbitNavChrome />
      </OrbitNavClip>
    )
  }

  const numUnpinned = activeAppsSorted.filter(x => x.tabDisplay === 'plain').length
  const tabWidth = numUnpinned > 5 ? 120 : numUnpinned < 3 ? 180 : 150

  const items = space.paneSort
    .map(
      (paneId, index): TabProps => {
        const app = activeAppsSorted.find(x => x.id === paneId)
        if (!app) {
          return null
        }
        const isLast = index === activeAppsSorted.length
        const isActive = !showCreateNew && `${paneId}` === activePaneId
        const next = activeAppsSorted[index + 1]
        const nextIsActive = next && paneManagerStore.activePane.id === `${next.id}`
        const isPinned = app.tabDisplay === 'pinned' || app.tabDisplay === 'permanent'
        return {
          app,
          width: tabWidth,
          separator: !isActive && !isLast && !nextIsActive,
          tabDisplay: app.tabDisplay,
          label: isPinned
            ? ''
            : app.identifier === 'search' && index === 0
            ? activeSpaceName
            : app.name,
          stretch: !isPinned,
          thicc: isPinned,
          isActive,
          icon: `orbit-${app.identifier}`,
          iconSize: isPinned ? 16 : 12,
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
                  save(AppModel, { ...app, pinned: !app.pinned })
                },
              },
              ...getAppContextItems(app),
            ]
          },
          onClick: () => {
            newAppStore.setShowCreateNew(false)
            paneManagerStore.setActivePane(`${app.id}`)
          },
          onClickPopout: !isPinned && Actions.tearApp,
        }
      },
    )
    .filter(Boolean)

  const pinWidth = 52

  const onSettings = isOnSettings(paneManagerStore.activePane)
  const showCreateNewWidth = showCreateNew ? tabWidth : 46
  const extraButtonsWidth = showCreateNewWidth

  const permanentItems = items.filter(x => x.tabDisplay === 'permanent')
  const pinnedItems = items.filter(x => x.tabDisplay === 'pinned')
  const pinnedItemsWidth = pinWidth * pinnedItems.length

  const epad = showCreateNew ? 0 : 3

  return (
    <OrbitNavClip>
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
            // let shadows from tabs go up above
            padding={epad}
            margin={-epad}
            height={tabHeight + 20}
            overflowX="auto"
            overflowY="hidden"
          />

          <SortableTabs
            className="hide-scrollbars"
            axis="x"
            lockAxis="x"
            distance={8}
            maxWidth={`calc(100% - ${pinnedItemsWidth + extraButtonsWidth - epad * 2}px)`}
            items={items.filter(x => !x.isPinned)}
            shouldCancelStart={isRightClick}
            onSortEnd={handleSortEnd}
            // let shadows from tabs go up above
            padding={epad}
            margin={-epad}
            height={tabHeight + 20}
            overflowX="auto"
            overflowY="hidden"
          />

          {showCreateNew && (
            <OrbitTab
              width={tabWidth}
              stretch
              iconSize={12}
              isActive
              label={'Add app'}
              after={
                <OrbitTabButton
                  icon="remove"
                  onClick={flow(
                    preventDefault,
                    Actions.previousTab,
                  )}
                />
              }
            />
          )}

          {!showCreateNew && (
            <OrbitTab
              tooltip={showCreateNew ? 'Cancel' : 'Add'}
              thicc
              icon={showCreateNew ? 'remove' : 'add'}
              iconAdjustOpacity={-0.2}
              onClick={Actions.setupNewApp}
            />
          )}
        </Row>

        <OrbitTab
          isActive={paneManagerStore.activePane.id === 'apps'}
          onClick={() => {
            newAppStore.setShowCreateNew(false)
            if (paneManagerStore.activePane.id === 'apps') {
              paneManagerStore.setActivePane(store.previousTabID)
            } else {
              paneManagerStore.setActivePaneByType('apps')
            }
          }}
          iconSize={11}
          icon="grid48"
          tooltip="Apps & Settings"
          thicc
        />

        {/* <OrbitTab
          isActive={onSettings}
          onClick={() => {
            newAppStore.setShowCreateNew(false)
            if (onSettings) {
              paneManagerStore.setActivePane(store.previousTabID)
            } else {
              paneManagerStore.setActivePaneByType('sources')
            }
          }}
          iconSize={12}
          icon="gear"
          tooltip="Settings"
          thicc
        /> */}
      </OrbitNavChrome>
    </OrbitNavClip>
  )
})

const OrbitNavClip = gloss({
  flex: 1,
  // zIndex: 10000000000,
  overflow: 'hidden',
  pointerEvents: 'none',
  padding: [20, 40, 0],
  margin: [-20, 0, 0],
  transform: {
    y: 0.5,
  },
})

const OrbitNavChrome = gloss({
  pointerEvents: 'auto',
  height: tabHeight,
  flexFlow: 'row',
  position: 'relative',
  alignItems: 'flex-end',
  // margin: [0, -40],
  // padding: [0, 40],
  justifyContent: 'space-between',
})

const SortableTab = SortableElement((props: TabProps) => {
  return <OrbitTab {...props} />
})

type SortableTabsProps = ViewProps & { items: TabProps[] }

const SortableTabs = SortableContainer(({ items, ...restProps }: SortableTabsProps) => {
  return (
    <Row {...restProps}>
      {items.map((item, index) => (
        <SortableTab {...item} key={index} index={index} />
      ))}
    </Row>
  )
})
