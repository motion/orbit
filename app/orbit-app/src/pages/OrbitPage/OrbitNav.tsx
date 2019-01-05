import { StoreContext } from '@mcro/black'
import { Text, View, Tooltip } from '@mcro/ui'
import * as React from 'react'
import { AppPanes } from '../../stores/SpaceStore'
import { Icon } from '../../views/Icon'
import * as UI from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import { gloss } from '@mcro/gloss'

export const SpaceNavHeight = () => <div style={{ height: 42, pointerEvents: 'none' }} />

export const OrbitNav = observer(() => {
  const { paneManagerStore } = React.useContext(StoreContext)
  return (
    <OrbitNavChrome className="draggable">
      {AppPanes.map(pane => {
        const isActive = paneManagerStore.activePane === pane.id
        return (
          <NavButton
            key={pane.id}
            isActive={isActive}
            label={pane.title}
            stretch
            onClick={paneManagerStore.activePaneSetter(pane.id)}
          >
            <Icon name={`${pane.icon}`} size={16} />
          </NavButton>
        )
      })}
      <NavButton tooltip="Create app">
        <UI.Icon name="simpleadd" size={12} opacity={0.35} />
      </NavButton>
      <View flex={1} minWidth={10} />
      <NavButton
        isActive={paneManagerStore.activePane === 'sources'}
        onClick={paneManagerStore.activePaneSetter('sources')}
        tooltip="Sources"
      >
        <UI.Icon name="app" size={14} opacity={0.5} />
      </NavButton>
      <NavButton
        isActive={paneManagerStore.activePane === 'settings'}
        onClick={paneManagerStore.activePaneSetter('settings')}
        tooltip="Settings"
      >
        <UI.Icon name="gear" size={14} opacity={0.5} />
      </NavButton>
    </OrbitNavChrome>
  )
})

const OrbitNavChrome = gloss({
  flexFlow: 'row',
  position: 'relative',
  zIndex: 1000,
  alignItems: 'flex-end',
  overflow: 'hidden',
  paddingTop: 20,
  marginTop: -20,
})

const buttonSidePad = 12

const NavButtonChrome = gloss<{ isActive?: boolean; stretch?: boolean }>({
  flexFlow: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: [5, buttonSidePad],
  height: 30,
  maxWidth: 180,
}).theme(({ isActive, stretch }, theme) => {
  const background = isActive
    ? theme.tabBackgroundActive || theme.background
    : theme.tabBackground || theme.background
  return {
    flex: stretch ? 1 : 'none',
    minWidth: stretch ? 90 : 0,
    background: isActive ? background : 'transparent',
    // border: [1, isActive ? theme.borderColor : 'transparent'],
    // borderBottom: 'none',
    boxShadow: isActive ? [[0, 0, 20, [0, 0, 0, 0.05]]] : null,
    borderTopRadius: 3,
    '&:hover': {
      background: isActive ? background : [0, 0, 0, 0.05],
      transition: isActive ? 'none' : 'all ease-out 500ms',
    },
  }
})

const NavButton = ({ children, tooltip = null, label = null, isActive = false, ...props }) => (
  <Tooltip label={tooltip}>
    <NavButtonChrome isActive={isActive} {...props}>
      {children}
      {!!label && (
        <Text
          size={0.95}
          marginLeft={buttonSidePad * 0.75}
          fontWeight={500}
          alpha={isActive ? 1 : 0.85}
        >
          {label}
        </Text>
      )}
    </NavButtonChrome>
  </Tooltip>
)
