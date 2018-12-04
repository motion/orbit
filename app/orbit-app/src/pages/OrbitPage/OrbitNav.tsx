import { attach, view } from '@mcro/black'
import { Text, View } from '@mcro/ui'
import * as React from 'react'
import { AppPanes } from '../../stores/SpaceStore'
import { PaneManagerStore } from '../../stores/PaneManagerStore'
import { Icon } from '../../views/Icon'

type Props = {
  paneManagerStore?: PaneManagerStore
}

export const SpaceNavHeight = () => <div style={{ height: 42, pointerEvents: 'none' }} />

@attach('paneManagerStore')
@view
export class OrbitNav extends React.Component<Props> {
  render() {
    const { paneManagerStore } = this.props
    const curIndex = Math.min(Math.max(0, paneManagerStore.paneIndex), AppPanes.length - 1)
    // const activeItem = AppPanes[curIndex]
    return (
      <OrbitNavChrome>
        {AppPanes.map((pane, index) => {
          const isActive = curIndex === index
          return (
            <NavButton key={pane.id}>
              <Icon name={`${pane.icon}`} size={16} />
              <Text
                marginLeft={10}
                fontWeight={200}
                size={1.05}
                alpha={isActive ? 1 : 0.5}
                onClick={paneManagerStore.activePaneSetter(index)}
              >
                {pane.title}
              </Text>
            </NavButton>
          )
        })}
        <View flex={1} minWidth={10} />
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

const NavButton = view({
  flexFlow: 'row',
  alignItems: 'center',
  padding: [6, 14],
}).theme(({ theme }) => ({
  '&:hover': {
    background: theme.backgroundHover,
  },
}))
