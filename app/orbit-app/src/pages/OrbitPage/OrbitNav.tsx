import { gloss, Row } from '@mcro/gloss'
import { save } from '@mcro/model-bridge'
import { AppModel } from '@mcro/models'
import { View } from '@mcro/ui'
import { flow, isEqual } from 'lodash'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'
import { OrbitTab, OrbitTabButton, tabHeight, TabProps } from '../../components/OrbitTab'
import { sleep } from '../../helpers'
import { preventDefault } from '../../helpers/preventDefault'
import { useActiveApps } from '../../hooks/useActiveApps'
import { useActiveSpace } from '../../hooks/useActiveSpace'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { OrbitOrb } from '../../views/OrbitOrb'

export default observer(function OrbitNav() {
  const {
    spaceStore,
    orbitStore,
    orbitWindowStore,
    paneManagerStore,
    newAppStore,
  } = useStoresSafe()
  const activeApps = useActiveApps()
  const [space, updateSpace] = useActiveSpace()
  const [showCreateNew, setShowCreateNew] = React.useState(false)

  // when pinned, we need to update paneSort so pinned is always first
  React.useEffect(
    () => {
      if (!space || !activeApps.length) {
        return
      }
      let pinned = []
      let unpinned = []
      for (const id of space.paneSort) {
        const app = activeApps.find(x => x.id === id)
        if (!app) {
          continue
        }
        if (app.pinned) {
          pinned.push(id)
        } else {
          unpinned.push(id)
        }
      }
      const paneSort = [...pinned, ...unpinned]
      if (!isEqual(paneSort, space.paneSort)) {
        updateSpace({ paneSort })
      }
    },
    [space && space.paneSort.join(''), activeApps.map(x => x.pinned).join('')],
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

  const items = space.paneSort
    .map(
      (id, index): TabProps => {
        const app = activeApps.find(x => x.id === id)
        if (!app) {
          return null
        }
        const isLast = index !== activeApps.length
        const isActive = !showCreateNew && paneManagerStore.activePane.id === `${app.id}`
        const nextIsActive =
          activeApps[index + 1] && paneManagerStore.activePane.id === `${activeApps[index + 1].id}`
        const isPinned = app.pinned
        return {
          app,
          separator: !isActive && isLast && !nextIsActive,
          label: isPinned ? '' : app.type === 'search' ? spaceStore.activeSpace.name : app.name,
          stretch: !isPinned,
          thicc: isPinned,
          isActive,
          icon: isPinned && `orbit-${app.type}`,
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
    .filter(Boolean)

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
            const { activePaneIndex } = orbitWindowStore
            // if they dragged active tab we need to sync the new activeIndex to PaneManager through here
            const activePaneId = space.paneSort[activePaneIndex]
            console.log('sort finish', paneSort, space.paneSort, activePaneIndex, activePaneId)
            if (activePaneId !== paneSort[activePaneIndex]) {
              orbitWindowStore.activePaneIndex = paneSort.indexOf(activePaneId)
              console.log('updating active index to', orbitWindowStore.activePaneIndex)
            }
            updateSpace({ paneSort })
          }}
        />
        {showCreateNew && (
          <OrbitTab
            stretch
            // icon={`orbit-custom`}
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
                    setShowCreateNew(false)
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
            iconAdjustOpacity={-0.2}
            onClick={async () => {
              setShowCreateNew(true)
              await sleep(10) // panemanager is heavy and this helps the ui from lagging
              paneManagerStore.setActivePane('app-createApp')
            }}
            transition="all ease-in 100ms"
          />
        )}
        <View flex={2} />
        <OrbitTab
          icon="layers"
          thicc
          isActive={paneManagerStore.activePane.type === 'sources'}
          onClick={paneManagerStore.activePaneByTypeSetter('sources')}
          tooltip="Manage Space"
        />
        <OrbitTab
          icon={<OrbitOrb colors={[[150, 150, 150, 0.3], [150, 150, 180, 0.3]]} size={12} />}
          thicc
          isActive={paneManagerStore.activePane.type === 'spaces'}
          onClick={paneManagerStore.activePaneByTypeSetter('spaces')}
          tooltip="Spaces"
        />
        {/* <OrbitTab icon={<OrbitSpaceSwitch width={12} height={12} />} thicc /> */}
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
