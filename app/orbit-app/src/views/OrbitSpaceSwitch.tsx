import { useModels } from '@o/bridge'
import { Icon, OrbitOrb, SpaceIcon, useActiveSpace, useActiveUser, useLocationLink } from '@o/kit'
import { SpaceModel } from '@o/models'
import { App } from '@o/stores'
import { Avatar, Col, Divider, ListItem, Popover, View } from '@o/ui'
import { ensure, react, useHook, useStore } from '@o/use-store'
import React, { memo } from 'react'
// @ts-ignore
import avatar from '../../public/images/nate.jpg'
import { useStoresSimple } from '../hooks/useStores'
import FocusableShortcutHandler from './FocusableShortcutHandler'

class SpaceSwitchStore {
  stores = useHook(useStoresSimple)
  popoverContentRef = React.createRef<HTMLDivElement>()
  selectedIndex = 0
  open = false
  query = ''
  spaceSwitcherRef = React.createRef<Popover>()

  setOpen = open => {
    this.open = open
    if (this.popoverContentRef.current) {
      this.popoverContentRef.current.focus()
    }
  }

  get spaces() {
    return this.stores.spaceStore.spaces
  }

  down = e => {
    e.stopPropagation()
    this.selectedIndex = Math.min(this.selectedIndex + 1, this.spaces.length - 1)
  }

  up = e => {
    e.stopPropagation()
    this.selectedIndex = Math.max(this.selectedIndex - 1, 0)
  }

  spaceOpener = react(
    () => App.state.showSpaceSwitcher,
    () => {
      const ref = this.spaceSwitcherRef.current
      ensure('ref', !!ref)
      if (ref) {
        ref.toggleOpen()
      }
    },
  )
}

const shortcuts = {
  select: 'enter',
  up: 'up',
  down: 'down',
}

export const OrbitSpaceSwitch = memo(function OrbitSpaceSwitch() {
  const stores = useStoresSimple()
  const store = useStore(SpaceSwitchStore)
  const [user] = useActiveUser()
  const activeSpaceId = (user && user.activeSpace) || -1
  const [activeSpace] = useActiveSpace()
  const [spaces] = useModels(SpaceModel, {})
  const accountLink = useLocationLink('settings?id=settings&itemId=account')

  if (!activeSpace) {
    return null
  }

  const handlers = {
    select: () => {
      console.log('should switch space')
      // switch active space
    },
    down: store.down,
    up: store.up,
  }

  const { selectedIndex } = store
  const borderRadius = 8

  return (
    <FocusableShortcutHandler focused={store.open} shortcuts={shortcuts} handlers={handlers}>
      <Popover
        ref={store.spaceSwitcherRef}
        delay={100}
        openOnClick
        closeOnClickAway
        closeOnClick
        themeName="light"
        width={300}
        background
        borderRadius={borderRadius}
        elevation={7}
        group="filters"
        onChangeVisibility={store.setOpen}
        target={
          <View position="relative" margin={[0, 6, 0, 18]}>
            <Avatar className="undraggable" src={avatar} width={20} height={20} />
            <OrbitOrb
              position="absolute"
              top="50%"
              marginTop={-12 / 2}
              left={-8}
              size={12}
              colors={activeSpace.colors}
            />
          </View>
        }
      >
        <Col ref={store.popoverContentRef} borderRadius={borderRadius} overflow="hidden" flex={1}>
          <View overflowY="auto" maxHeight={300}>
            {user ? (
              <ListItem
                icon={<Avatar src={avatar} width={30} height={30} margin={[0, 6, 0, 0]} />}
                iconBefore
                title={user.name}
                subtitle="Active"
                onClick={accountLink}
              />
            ) : (
              <div>No spaces</div>
            )}
            <Divider />
            {spaces.map((space, index) => {
              return (
                <ListItem
                  key={space.id}
                  icon={<SpaceIcon space={space} />}
                  iconBefore
                  after={
                    activeSpaceId === space.id && <Icon name="check" color="#449878" size={12} />
                  }
                  onClick={() => {
                    console.warn('ok')
                  }}
                  isSelected={selectedIndex === index + 1}
                  title={space.name}
                  titleProps={{ fontWeight: 400, size: 0.95, alpha: 0.8 }}
                />
              )
            })}
            <ListItem
              title="Space Settings"
              subtitle="Manage spaces..."
              icon="layers"
              iconBefore
              titleProps={{ fontWeight: 300, size: 0.9, alpha: 0.8 }}
              after={<Icon name="addcircle" size={14} fill="#444" />}
            />

            <Divider />

            <ListItem
              title="Settings"
              subtitle="Shortcuts, theme"
              icon="gear"
              iconBefore
              onClick={() => {
                stores.newAppStore.setShowCreateNew(false)
                stores.paneManagerStore.setActivePaneByType('settings')
              }}
            />
          </View>
        </Col>
      </Popover>
    </FocusableShortcutHandler>
  )
})
