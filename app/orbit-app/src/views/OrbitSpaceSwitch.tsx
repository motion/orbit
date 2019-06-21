import { useModels } from '@o/bridge'
import { OrbitOrb, SpaceIcon, useActiveSpace, useActiveUser, useLocationLink } from '@o/kit'
import { SpaceModel } from '@o/models'
import { App } from '@o/stores'
import { Avatar, Col, GlobalHotKeys, Icon, ListItem, ListSeparator, Popover, Toggle, View } from '@o/ui'
import { ensure, react, useStore } from '@o/use-store'
import React, { memo } from 'react'

// @ts-ignore
const avatar = require('../../public/images/nate.jpg')

class SpaceSwitchStore {
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

  down() {}

  up() {}

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

export const OrbitSpaceSwitch = memo(function OrbitSpaceSwitch() {
  const store = useStore(SpaceSwitchStore)
  const [user, updateUser] = useActiveUser()
  const activeSpaceId = (user && user.activeSpace) || -1
  const [activeSpace] = useActiveSpace()
  const [spaces] = useModels(SpaceModel, {})
  const accountLink = useLocationLink('/app/settings/account')
  const settingsLink = useLocationLink('/app/settings')

  if (!activeSpace) {
    return null
  }

  const handlers = {
    SELECT: () => {
      console.log('should switch space')
    },
    DOWN: store.down,
    UP: store.up,
  }

  const { selectedIndex } = store
  const borderRadius = 8

  return (
    <>
      {store.open && (
        <GlobalHotKeys
          keyMap={{
            SELECT: 'enter',
            UP: 'up',
            DOWN: 'down',
          }}
          handlers={handlers}
        />
      )}

      <Popover
        ref={store.spaceSwitcherRef}
        delay={500}
        openOnHover
        closeOnClickAway
        closeOnClick
        popoverTheme="light"
        width={300}
        background
        borderRadius={borderRadius}
        elevation={7}
        onChangeVisibility={store.setOpen}
        target={
          <View position="relative" margin={[0, 6, 0, 18]} onClick={accountLink}>
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
        <Col
          scrollable="y"
          ref={store.popoverContentRef}
          borderRadius={borderRadius}
          flex={1}
          maxHeight={window.innerHeight - 120}
        >
          {user ? (
            <ListItem
              icon={<Avatar src={avatar} width={26} height={26} />}
              iconBefore
              title={user.name}
              subTitle="Active"
              {...accountLink}
            />
          ) : (
            <div>No spaces</div>
          )}

          <ListSeparator>Recent Spaces</ListSeparator>
          {spaces.slice(0, 3).map((space, index) => {
            return (
              <ListItem
                key={space.id}
                icon={<SpaceIcon space={space} />}
                iconBefore
                after={activeSpaceId === space.id && <Icon name="tick" color="#449878" size={12} />}
                onClick={() => {
                  console.warn('ok')
                }}
                isSelected={selectedIndex === index + 1}
                title={space.name}
                titleProps={{ fontWeight: 400, size: 0.95, alpha: 0.8 }}
              />
            )
          })}

          <ListSeparator>Settings</ListSeparator>

          <ListItem
            onClick={e => e.stopPropagation()}
            title="Dark mode"
            icon="moon"
            after={
              <View opacity={user.settings.theme === 'automatic' ? 0.5 : 1}>
                <Toggle
                  defaultChecked={user.settings.theme === 'dark' ? true : false}
                  onChange={dark => {
                    updateUser(user => {
                      user.settings.theme = dark ? 'dark' : 'light'
                    })
                  }}
                />
              </View>
            }
          />

          <ListItem
            title="Space Settings"
            subTitle="Manage spaces..."
            icon="layers"
            iconBefore
            after={<Icon name="addcircle" size={14} fill="#444" />}
          />

          <ListItem
            title="Settings"
            subTitle="Shortcuts, theme"
            icon="cog"
            iconBefore
            onClick={settingsLink}
          />
        </Col>
      </Popover>
    </>
  )
})
