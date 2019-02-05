import { gloss, Row, ViewProps } from '@mcro/gloss'
import { save } from '@mcro/model-bridge'
import { AppModel } from '@mcro/models'
import { View } from '@mcro/ui'
import { flow } from 'lodash'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { OrbitTab, OrbitTabButton, tabHeight, TabProps } from '../../components/OrbitTab'
import { sleep } from '../../helpers'
import { preventDefault } from '../../helpers/preventDefault'
import { useActiveApps } from '../../hooks/useActiveApps'
import { useActiveSpace } from '../../hooks/useActiveSpace'
import { useAppSortHandler } from '../../hooks/useAppSortHandler'
import { useStoresSafe } from '../../hooks/useStoresSafe'

export default observer(function OrbitNav() {
  const { spaceStore, orbitStore, paneManagerStore, newAppStore } = useStoresSafe()
  const activeApps = useActiveApps()
  const [space] = useActiveSpace()
  const [showCreateNew, setShowCreateNew] = React.useState(false)
  const handleSortEnd = useAppSortHandler()

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

  const isOnSettings =
    paneManagerStore.activePane.type === 'sources' ||
    paneManagerStore.activePane.type === 'spaces' ||
    paneManagerStore.activePane.type === 'settings'

  return (
    <OrbitNavClip>
      <OrbitNavChrome>
        <SortableTabs
          axis="x"
          lockAxis="x"
          distance={8}
          items={items}
          shouldCancelStart={isRightClick}
          onSortEnd={handleSortEnd}
          flex={3000}
          overflow="hidden"
          flexWrap="wrap"
          height={tabHeight}
          opacity={isOnSettings ? 0.5 : 1}
          transition="opacity ease 300ms"
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
        <View flex={1} />

        <OrbitTab
          isActive={isOnSettings}
          onClick={paneManagerStore.activePaneByTypeSetter('sources')}
          iconSize={14}
          icon="gear"
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
