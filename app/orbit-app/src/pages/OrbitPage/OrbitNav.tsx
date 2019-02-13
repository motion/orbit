import { ensure, react } from '@mcro/black'
import { gloss, Row, View, ViewProps } from '@mcro/gloss'
import { AppModel } from '@mcro/models'
import { BorderBottom } from '@mcro/ui'
import { useHook, useStore } from '@mcro/use-store'
import { flow } from 'lodash'
import React, { memo } from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { useActions } from '../../actions/Actions'
import { OrbitTab, OrbitTabButton, tabHeight, TabProps } from '../../components/OrbitTab'
import { sleep } from '../../helpers'
import { getAppContextItems } from '../../helpers/getAppContextItems'
import { getIsTorn } from '../../helpers/getAppHelpers'
import { isRightClick } from '../../helpers/isRightClick'
import { preventDefault } from '../../helpers/preventDefault'
import { useActiveAppsSorted } from '../../hooks/useActiveAppsSorted'
import { useActiveSpace } from '../../hooks/useActiveSpace'
import { useAppSortHandler } from '../../hooks/useAppSortHandler'
import { useStores, useStoresSimple } from '../../hooks/useStores'
import { save } from '../../mediator'
import { Pane } from '../../stores/PaneManagerStore'

const isOnSettings = (pane?: Pane) =>
  (pane && pane.type === 'sources') || pane.type === 'spaces' || pane.type === 'settings'

class OrbitNavStore {
  stores = useHook(useStoresSimple)

  previousTabID = react(
    () => this.stores.paneManagerStore.activePane,
    pane => {
      ensure('not on settings', !isOnSettings(pane))
      return pane.id
    },
  )
}

export default memo(function OrbitNav() {
  const { spaceStore, paneManagerStore, newAppStore } = useStores({ debug: true })
  const Actions = useActions()
  const store = useStore(OrbitNavStore)
  const { showCreateNew } = newAppStore
  const activeSpaceName = spaceStore.activeSpace.name
  const activeAppsSorted = useActiveAppsSorted()
  const activePaneId = paneManagerStore.activePane.id
  const [space] = useActiveSpace()
  const handleSortEnd = useAppSortHandler()
  const isTorn = getIsTorn()

  if (isTorn) {
    if (!paneManagerStore.activePane) {
      console.error('no active pane?')
    }
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

  const numUnpinned = activeAppsSorted.filter(x => !x.pinned).length

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
        const isPinned = app.pinned
        return {
          app,
          width: numUnpinned > 5 ? 120 : numUnpinned < 3 ? 180 : 150,
          separator: !isActive && !isLast && !nextIsActive,
          isPinned,
          label: isPinned ? '' : app.type === 'search' ? activeSpaceName : app.name,
          stretch: !isPinned,
          thicc: isPinned,
          isActive,
          icon: `orbit-${app.type}`,
          // iconProps: isPinned ? { color: app.colors[0] } : null,
          iconSize: isPinned ? 18 : 12,
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
                  // TODO umed type not accepting
                  save(AppModel, { ...app, pinned: !app.pinned } as any)
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

  const onSettings = isOnSettings(paneManagerStore.activePane)
  const showAppsTray = activeAppsSorted.length > 5

  return (
    <OrbitNavClip>
      <OrbitNavChrome>
        <Row
          height={tabHeight}
          flex={200}
          overflow="hidden"
          maxWidth={`calc(100% - ${(showCreateNew ? 120 : 80) + (showAppsTray ? 20 : 0)}px)`}
        >
          {items
            .filter(x => x.isPinned)
            .map(props => (
              <OrbitTab key={props.app.id} {...props} />
            ))}

          <SortableTabs
            className="hide-scrollbars"
            axis="x"
            lockAxis="x"
            distance={8}
            items={items.filter(x => !x.isPinned)}
            shouldCancelStart={isRightClick}
            onSortEnd={handleSortEnd}
            flex={1}
            // let shadows from tabs go up above
            padding={[16, 0]}
            margin={[-16, 0]}
            height={tabHeight + 20}
            overflowX="auto"
            overflowY="hidden"
            opacity={onSettings ? 0.5 : 1}
            transition="opacity ease 300ms"
          />

          {showCreateNew && (
            <OrbitTab
              stretch
              iconSize={12}
              isActive
              label={newAppStore.app.name || 'New app'}
              after={
                <OrbitTabButton
                  icon="remove"
                  opacity={0.5}
                  onClick={flow(
                    preventDefault,
                    () => {
                      newAppStore.setShowCreateNew(false)
                      paneManagerStore.back()
                    },
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
              iconAdjustOpacity={-0.1}
              onClick={async () => {
                newAppStore.setShowCreateNew(true)
                await sleep(10) // panemanager is heavy and this helps the ui from lagging
                paneManagerStore.setActivePane('createApp')
              }}
            />
          )}
        </Row>

        <View flex={1} />

        {showAppsTray && (
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
            tooltip="Apps"
            thicc
          />
        )}

        <OrbitTab
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
        />
      </OrbitNavChrome>
      <BorderBottom zIndex={100} />
    </OrbitNavClip>
  )
})

const OrbitNavClip = gloss({
  flex: 1,
  // zIndex: 10000000000,
  overflow: 'hidden',
  padding: [20, 40, 0],
  margin: [-20, 0, 0],
  transform: {
    y: 0.5,
  },
})

const OrbitNavChrome = gloss({
  height: tabHeight,
  flexFlow: 'row',
  position: 'relative',
  alignItems: 'flex-end',
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
