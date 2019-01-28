import { gloss, Row } from '@mcro/gloss'
import { View } from '@mcro/ui'
import { capitalize } from 'lodash'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'
import { OrbitTab, tabHeight, TabProps } from '../../components/OrbitTab'
import { useActiveApps } from '../../hooks/useActiveApps'
import { useActiveSpace } from '../../hooks/useActiveSpace'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { useUserSpaceConfig } from '../../hooks/useUserSpaceConfig'

export default observer(function OrbitNav() {
  const { orbitStore, paneManagerStore, newAppStore } = useStoresSafe()
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
      const isLast = index !== activeApps.length
      const isActive = !showCreateNew && paneManagerStore.activePane.id === app.id
      const nextIsActive =
        activeApps[index + 1] && paneManagerStore.activePane.id === activeApps[index + 1].id
      const isPinned = app.type === 'search'
      return {
        app,
        separator: !isActive && isLast && !nextIsActive,
        label: isPinned ? '' : app.name,
        stretch: !isPinned,
        thicc: isPinned,
        isActive,
        icon: `orbit${capitalize(app.type)}`,
        iconSize: isPinned ? 16 : 12,
        onClick: () => {
          setShowCreateNew(false)
          paneManagerStore.setActivePane(app.id)
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
            icon={`orbit${capitalize(newAppStore.type)}`}
            iconSize={12}
            isActive
            label={newAppStore.name || 'New app'}
          />
        )}
        <OrbitTab
          tooltip={showCreateNew ? 'Cancel' : 'Add'}
          thicc
          icon={showCreateNew ? 'remove' : 'add'}
          iconAdjustOpacity={-0.2}
          onClick={() => {
            if (!showCreateNew) {
              paneManagerStore.setActivePaneByType('createApp')
            } else {
              paneManagerStore.back()
            }
            setShowCreateNew(!showCreateNew)
          }}
        />
        <View flex={2} />
        <OrbitTab
          thicc
          isActive={paneManagerStore.activePane.type === 'apps'}
          onClick={paneManagerStore.activePaneByTypeSetter('apps')}
          tooltip="All Apps"
          separator
          icon="orbitApps"
          iconSize={12}
        />
        <OrbitTab
          thicc
          isActive={paneManagerStore.activePane.type === 'sources'}
          onClick={paneManagerStore.activePaneByTypeSetter('sources')}
          tooltip="Sources"
          icon="design_app"
          iconSize={11}
        />
      </OrbitNavChrome>
    </OrbitNavClip>
  )
})

const OrbitNavClip = gloss({
  overflow: 'hidden',
  padding: [20, 40, 0],
  margin: [-20, 0, 0],
}).theme((_, theme) => ({
  boxShadow: [['inset', 0, -0.5, 0, theme.borderColor.alpha(0.6)]],
}))

const OrbitNavChrome = gloss({
  height: tabHeight,
  flexFlow: 'row',
  position: 'relative',
  zIndex: 1000,
  alignItems: 'flex-end',
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
