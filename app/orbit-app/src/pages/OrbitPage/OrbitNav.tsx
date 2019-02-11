import { ensure, react } from '@mcro/black'
import { gloss, Row, ViewProps } from '@mcro/gloss'
import { save } from '@mcro/model-bridge'
import { AppModel } from '@mcro/models'
import { BorderBottom, View } from '@mcro/ui'
import { useHook, useStore } from '@mcro/use-store'
import { flow } from 'lodash'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { AppType } from '../../apps/AppTypes'
import { OrbitTab, OrbitTabButton, tabHeight, TabProps } from '../../components/OrbitTab'
import { sleep } from '../../helpers'
import { getAppContextItems } from '../../helpers/getAppContextItems'
import { isRightClick } from '../../helpers/isRightClick'
import { preventDefault } from '../../helpers/preventDefault'
import { useActiveAppsSorted } from '../../hooks/useActiveAppsSorted'
import { useActiveSpace } from '../../hooks/useActiveSpace'
import { useAppSortHandler } from '../../hooks/useAppSortHandler'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { Pane } from '../../stores/PaneManagerStore'

const isOnSettings = (pane?: Pane) =>
  (pane && pane.type === 'sources') || pane.type === 'spaces' || pane.type === 'settings'

class OrbitNavStore {
  stores = useHook(useStoresSafe)

  previousTabID = react(
    () => this.stores.paneManagerStore.activePane,
    pane => {
      ensure('not on settings', !isOnSettings(pane))
      return pane.id
    },
  )
}

export default observer(function OrbitNav() {
  const { spaceStore, orbitStore, paneManagerStore, newAppStore } = useStoresSafe()
  const store = useStore(OrbitNavStore)
  const { showCreateNew } = newAppStore
  const activeAppsSorted = useActiveAppsSorted()
  const activePaneId = paneManagerStore.activePane.id
  const activeApp = activeAppsSorted.find(app => activePaneId === `${app.id}`)
  const [space] = useActiveSpace()
  const handleSortEnd = useAppSortHandler()

  console.debug('OrbitNa')

  if (orbitStore.isTorn) {
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
          separator: !isActive && !isLast && !nextIsActive,
          label: isPinned ? '' : app.type === 'search' ? spaceStore.activeSpace.name : app.name,
          stretch: !isPinned,
          thicc: isPinned,
          isActive,
          icon: `orbit-${app.type}`,
          // iconProps: isPinned ? { color: app.colors[0] } : null,
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
          onClickPopout:
            !isPinned &&
            (() => {
              orbitStore.setTorn()
            }),
        }
      },
    )
    .filter(Boolean)

  const onSettings = isOnSettings(paneManagerStore.activePane)

  return (
    <OrbitNavClip>
      <OrbitNavChrome>
        <SortableTabs
          axis="x"
          lockAxis="x"
          distance={8}
          items={items}
          maxWidth={`calc(100% - ${showCreateNew ? 220 : 120}px)`}
          shouldCancelStart={isRightClick}
          onSortEnd={handleSortEnd}
          overflow="hidden"
          // let shadows from tabs go up above
          padding={10}
          height={tabHeight + 20}
          margin={[0, -10, -10]}
          flexWrap="wrap"
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

        <View flex={1} />

        {activeApp && activeApp.type === AppType.custom && !orbitStore.isEditing && (
          <OrbitTab
            thicc
            icon="tool"
            tooltip="Edit app"
            onClick={async () => {
              orbitStore.setTorn()
              orbitStore.setEditing()
            }}
          />
        )}

        {activeAppsSorted.length > 5 && (
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
      <BorderBottom zIndex={-1} />
    </OrbitNavClip>
  )
})

const OrbitNavClip = gloss({
  zIndex: 10000000000,
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
