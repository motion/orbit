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
    <OrbitNavChrome>
      {AppPanes.map(pane => {
        const isActive = paneManagerStore.activePane === pane.id
        return (
          <NavButton
            key={pane.id}
            isActive={isActive}
            label={pane.title}
            onClick={paneManagerStore.activePaneSetter(pane.id)}
          >
            <Icon name={`${pane.icon}`} size={16} />
          </NavButton>
        )
      })}
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
})

const NavButtonChrome = gloss({
  flexFlow: 'row',
  alignItems: 'center',
  padding: [6, 14],
}).theme(({ isActive }, theme) => {
  const background = isActive
    ? theme.tabBackgroundActive || theme.background
    : theme.tabBackground || theme.background
  return {
    background: isActive ? background : 'transparent',
    '&:hover': {
      background: isActive ? background : [0, 0, 0, 0.05],
      transition: isActive ? 'none' : 'all ease-out 500ms',
    },
  }
})

const NavButton = ({ children, tooltip = null, label = null, isActive, ...props }) => (
  <Tooltip label={tooltip}>
    <NavButtonChrome isActive={isActive} {...props}>
      {children}
      {!!label && (
        <Text marginLeft={10} fontWeight={400} size={1} alpha={isActive ? 1 : 0.85}>
          {label}
        </Text>
      )}
    </NavButtonChrome>
  </Tooltip>
)
