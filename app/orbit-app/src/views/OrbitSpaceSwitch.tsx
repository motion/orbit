import { ensure, react } from '@mcro/black'
import { useModels } from '@mcro/bridge'
import { Icon, useActiveSpace, useStoresSimple } from '@mcro/kit'
import { SpaceModel } from '@mcro/models'
import { App } from '@mcro/stores'
import { Avatar, Col, ListItem, Popover, View } from '@mcro/ui'
import { useHook, useStore } from '@mcro/use-store'
import React, { memo } from 'react'
// @ts-ignore
import avatar from '../../public/images/nate.jpg'
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
  const store = useStore(SpaceSwitchStore)
  const [activeSpace] = useActiveSpace()
  const [spaces] = useModels(SpaceModel, {})

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
        themeName="light"
        width={300}
        background
        borderRadius={borderRadius}
        elevation={7}
        group="filters"
        onChangeVisibility={store.setOpen}
        target={
          <View>
            <Avatar src={avatar} width={22} height={22} margin={[0, 6, 0, 12]} />
          </View>
        }
      >
        <Col ref={store.popoverContentRef} borderRadius={borderRadius} overflow="hidden" flex={1}>
          <View overflowY="auto" maxHeight={300}>
            {activeSpace ? (
              <ListItem slim title={activeSpace.name} subtitle="20 people" />
            ) : (
              <div>No spaces</div>
            )}
            <View
              flex={1}
              margin={[2, 10]}
              background={theme => theme.color.alpha(0.2)}
              height={1}
            />
            {spaces.map((space, index) => {
              return (
                <ListItem
                  key={space.id}
                  slim
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
              slim
              title="Manage spaces..."
              titleProps={{ fontWeight: 300, size: 0.9, alpha: 0.8 }}
              after={<Icon name="addcircle" size={14} fill="#444" />}
            />
          </View>
        </Col>
      </Popover>
    </FocusableShortcutHandler>
  )
})
