import { gloss, Row } from '@mcro/gloss'
import { save } from '@mcro/model-bridge'
import { AppModel } from '@mcro/models'
import { View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'
import { OrbitTab, tabHeight, TabProps } from '../../components/OrbitTab'
import { useActiveApps } from '../../hooks/useActiveApps'
import { useActiveSpace } from '../../hooks/useActiveSpace'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { useUserSpaceConfig } from '../../hooks/useUserSpaceConfig'

export default observer(function OrbitNav() {
  const { spaceStore, orbitStore, paneManagerStore, newAppStore } = useStoresSafe()
  const activeApps = useActiveApps()
  const appIds = activeApps.map(x => x.id)
  const [space, updateSpace] = useActiveSpace()
  const [spaceConfig, updateSpaceConfig] = useUserSpaceConfig()
  const [showCreateNew, setShowCreateNew] = React.useState(false)

  // keep apps in sync with paneSort
  // TODO: this can be refactored into useSyncSpacePaneOrderEffect
  //       but we should refactor useObserve/useModel first so it re-uses
  //       identical queries using a WeakMap so we dont have tons of observes...
  React.useEffect(
    () => {
      if (!space || !activeApps.length) {
        return
      }
      if (!space.paneSort) {
        updateSpace({ paneSort: activeApps.map(x => x.id) })
        return
      }
      if (activeApps.length && activeApps.length !== space.paneSort.length) {
        updateSpace({ paneSort: activeApps.map(x => x.id) })
        return
      }
    },
    [space && space.id, appIds.join('')],
  )

  if (orbitStore.isTorn) {
    return null
  }

  // after hooks

  if (!activeApps.length || !space || !space.paneSort) {
    return (
      <OrbitNavClip>
        <OrbitNavChrome />
      </OrbitNavClip>
    )
  }

  const items = space.paneSort.map(
    (id, index): TabProps => {
      const app = activeApps.find(x => x.id === id)
      const pinnedApps = activeApps.filter(x => x.pinned).length
      const isLast = index !== activeApps.length
      const isActive = !showCreateNew && paneManagerStore.activePane.id === `${app.id}`
      const nextIsActive =
        activeApps[index + 1] && paneManagerStore.activePane.id === `${activeApps[index + 1].id}`
      const isPinned = app.pinned
      return {
        app,
        separator: !isActive && isLast && !nextIsActive,
        label: isPinned ? '' : app.type === 'search' ? spaceStore.activeSpace.name : app.name,
        // disable if its the only sortable tab, or if its pinned
        disabled: isPinned || pinnedApps === 1,
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
              label: 'Toggle Pinned',
              checked: isPinned,
              click() {
                // TODO umed type not accepting
                save(AppModel, { ...app, pinned: !app.pinned } as any)
              },
            },
            {
              label: 'Remove tab',
            },
          ]
        },
        onClick: () => {
          setShowCreateNew(false)
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

  return (
    <OrbitNavClip>
      <OrbitNavChrome>
        <SortableTabs
          axis="x"
          lockAxis="x"
          distance={8}
          items={items}
          shouldCancelStart={isRightClick}
          onSortEnd={({ oldIndex, newIndex }) => {
            const paneSort = arrayMove([...space.paneSort], oldIndex, newIndex)
            const { activePaneIndex } = spaceConfig
            // if they dragged active tab we need to sync the new activeIndex to PaneManager through here
            const activePaneId = space.paneSort[activePaneIndex]
            console.log('sort finish', paneSort, space.paneSort, activePaneIndex, activePaneId)
            if (activePaneId !== paneSort[activePaneIndex]) {
              console.log('updating active index to', paneSort.indexOf(activePaneId))
              updateSpaceConfig({
                activePaneIndex: paneSort.indexOf(activePaneId),
              })
            }
            updateSpace({ paneSort })
          }}
        />
        {showCreateNew && (
          <OrbitTab
            stretch
            icon={`orbit-${newAppStore.app.type}`}
            iconSize={12}
            isActive
            label={newAppStore.app.name || 'New app'}
          />
        )}
        <OrbitTab
          tooltip={showCreateNew ? 'Cancel' : 'Add'}
          thicc
          icon={showCreateNew ? 'remove' : 'add'}
          iconAdjustOpacity={-0.2}
          onClick={() => {
            if (!showCreateNew) {
              paneManagerStore.setActivePane('app-createApp')
            } else {
              paneManagerStore.back()
            }
            setShowCreateNew(!showCreateNew)
          }}
        />
        <View flex={2} />
        {/* <OrbitTab
          thicc
          isActive={paneManagerStore.activePane.type === 'apps'}
          onClick={paneManagerStore.activePaneByTypeSetter('apps')}
          tooltip="All Apps"
          separator
          icon="orbit-apps"
          iconSize={12}
        /> */}
        <OrbitTab
          thicc
          isActive={paneManagerStore.activePane.type === 'sources'}
          onClick={paneManagerStore.activePaneByTypeSetter('sources')}
          tooltip="Manage Space"
          icon="grid48"
          iconSize={11}
        />
      </OrbitNavChrome>
    </OrbitNavClip>
  )
})

// https://github.com/clauderic/react-sortable-hoc/issues/256
const isRightClick = e =>
  (e.buttons === 1 && e.ctrlKey === true) || // macOS trackpad ctrl click
  (e.buttons === 2 && e.button === 2) // Regular mouse or macOS double-finger tap

const OrbitNavClip = gloss({
  zIndex: 10000000000,
  overflow: 'hidden',
  padding: [20, 40, 0],
  margin: [-20, 0, 0],
  transform: {
    y: 0.5,
  },
}).theme((_, theme) => ({
  boxShadow: [['inset', 0, -0.5, 0, theme.borderColor.alpha(0.6)]],
}))

const OrbitNavChrome = gloss({
  height: tabHeight,
  flexFlow: 'row',
  position: 'relative',
  alignItems: 'flex-end',
  // '& .orbit-tab-inactive.unpinned .tab-icon': {
  //   transition: 'all ease 300ms',
  //   opacity: 0,
  // },
  // '&:hover .orbit-tab-inactive.unpinned .tab-icon': {
  //   // transition: 'all ease 1200ms 500ms',
  //   opacity: 0,
  // },
  // background: '#00000099',
})

const SortableTab = SortableElement((props: TabProps) => {
  return <OrbitTab {...props} />
})

const SortableTabs = SortableContainer((props: { items: TabProps[] }) => {
  return (
    <Row>
      {props.items.map((item, index) => (
        <SortableTab {...item} key={index} index={index} />
      ))}
    </Row>
  )
})
