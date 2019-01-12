import { Text, View, Tooltip } from '@mcro/ui'
import * as React from 'react'
import { AppPanes } from '../../stores/SpaceStore'
import { Icon } from '../../views/Icon'
import { observer } from 'mobx-react-lite'
import { gloss } from '@mcro/gloss'
import { useObserveActiveApps } from '../../hooks/useObserveActiveApps'
import { useStoresSafe } from '../../hooks/useStoresSafe'

export const SpaceNavHeight = () => <div style={{ height: 42, pointerEvents: 'none' }} />

export const OrbitNav = observer(() => {
  const { paneManagerStore } = useStoresSafe()
  const apps = useObserveActiveApps()

  return (
    <OrbitNavClip>
      <OrbitNavChrome>
        {apps.map((app, index) => {
          const isLast = index !== AppPanes.length - 1
          const isActive = paneManagerStore.activePane === app.id
          const nextIsActive =
            AppPanes[index + 1] && paneManagerStore.activePane === AppPanes[index + 1].id
          return (
            <NavButton
              key={app.id}
              isActive={isActive}
              label={app.name}
              stretch
              separator={!isActive && isLast && !nextIsActive}
              onClick={paneManagerStore.activePaneSetter(app.id)}
            >
              <Icon name={`${app.type}`} size={14} opacity={isActive ? 1 : 0.8} />
            </NavButton>
          )
        })}
        <NavButton tooltip="Create app">
          <Icon name="simpleadd" size={12} opacity={0.35} />
        </NavButton>
        <View flex={1} minWidth={10} />
        <NavButton
          isActive={paneManagerStore.activePane === 'sources'}
          onClick={paneManagerStore.activePaneSetter('sources')}
          label="Sources"
        />
      </OrbitNavChrome>
    </OrbitNavClip>
  )
})

const OrbitNavClip = gloss({
  overflow: 'hidden',
  padding: [20, 10, 0],
  margin: [-20, 0, 0],
})

const OrbitNavChrome = gloss({
  flexFlow: 'row',
  position: 'relative',
  zIndex: 1000,
  alignItems: 'flex-end',
  // background: '#00000099',
})

const buttonSidePad = 12

const NavButtonChrome = gloss<{ isActive?: boolean; stretch?: boolean }>({
  position: 'relative',
  flexFlow: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: [5, buttonSidePad],
  height: 28,
  maxWidth: 180,
  borderTopRadius: 3,
}).theme(({ isActive, stretch }, theme) => {
  const background = isActive
    ? theme.tabBackgroundActive || theme.background
    : theme.tabBackground || theme.background
  return {
    flex: stretch ? 1 : 'none',
    minWidth: stretch ? 90 : 0,
    background: isActive ? background : 'transparent',
    // textShadow: isActive ? 'none' : `0 -1px 0 #ffffff55`,
    // border: [1, isActive ? theme.borderColor : 'transparent'],
    // borderBottom: 'none',
    boxShadow: isActive ? [[0, 0, 20, [0, 0, 0, 0.05]]] : null,
    // borderTopRadius: 3,
    '&:hover': {
      background: isActive ? background : [0, 0, 0, 0.05],
      transition: isActive ? 'none' : 'all ease-out 500ms',
    },
  }
})

const NavButton = ({
  children = null,
  tooltip = null,
  label = null,
  isActive = false,
  separator = false,
  textProps = null,
  ...props
}) => (
  <Tooltip label={tooltip}>
    <NavButtonChrome className="undraggable" isActive={isActive} {...props}>
      {children}
      {!!label && (
        <Text
          size={0.95}
          marginLeft={!!children ? buttonSidePad * 0.75 : 0}
          alpha={isActive ? 1 : 0.85}
          fontWeight={500}
          {...textProps}
        >
          {label}
        </Text>
      )}
      {separator && <Separator />}
    </NavButtonChrome>
  </Tooltip>
)

const Separator = gloss({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  width: 1,
  background: 'linear-gradient(transparent, rgba(0,0,0,0.08))',
})
