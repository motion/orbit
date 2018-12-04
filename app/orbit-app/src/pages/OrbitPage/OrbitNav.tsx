import { attach, view } from '@mcro/black'
import { Text, View } from '@mcro/ui'
import * as React from 'react'
import { AppPanes } from '../../stores/SpaceStore'
import { PaneManagerStore } from '../../stores/PaneManagerStore'
import { Icon } from '../../views/Icon'
import * as UI from '@mcro/ui'

type Props = {
  paneManagerStore?: PaneManagerStore
}

export const SpaceNavHeight = () => <div style={{ height: 42, pointerEvents: 'none' }} />

@attach('paneManagerStore')
@view
export class OrbitNav extends React.Component<Props> {
  render() {
    const { paneManagerStore } = this.props
    return (
      <OrbitNavChrome>
        {AppPanes.map((pane, index) => {
          const isActive = paneManagerStore.activePane === pane.id
          return (
            <NavButton
              key={pane.id}
              isActive={isActive}
              label={pane.title}
              onClick={paneManagerStore.activePaneSetter(index)}
            >
              <Icon name={`${pane.icon}`} size={16} />
            </NavButton>
          )
        })}
        <View flex={1} minWidth={10} />
        <NavButton
          label="Settings"
          isActive={paneManagerStore.activePane === 'settings'}
          onClick={paneManagerStore.activePaneSetter('settings')}
        >
          <UI.Icon name="gear" size={16} opacity={0.5} />
        </NavButton>
      </OrbitNavChrome>
    )
  }
}

const OrbitNavChrome = view({
  flexFlow: 'row',
  position: 'relative',
  zIndex: 1000,
  alignItems: 'center',
}).theme(({ theme }) => ({
  borderBottom: [1, theme.borderColor.alpha(0.5)],
}))

const NavButtonChrome = view({
  flexFlow: 'row',
  alignItems: 'center',
  padding: [6, 14],
}).theme(({ theme, isActive }) => ({
  background: isActive ? theme.background : 'transparent',
  '&:hover': {
    background: isActive ? theme.background : [0, 0, 0, 0.05],
  },
}))

const NavButton = ({ children, label, isActive, ...props }) => (
  <NavButtonChrome isActive={isActive} {...props}>
    {children}
    <Text marginLeft={10} fontWeight={200} size={1.05} alpha={isActive ? 1 : 0.5}>
      {label}
    </Text>
  </NavButtonChrome>
)
