import { attach, view } from '@mcro/black'
import { Row, Text, View } from '@mcro/ui'
import * as React from 'react'
import { AppPanes } from '../../../stores/SpaceStore'
import { PaneManagerStore } from '../../../stores/PaneManagerStore'
import { Icon } from '../../../views/Icon'

type Props = {
  paneManagerStore?: PaneManagerStore
}

export const SpaceNavHeight = () => <div style={{ height: 42, pointerEvents: 'none' }} />

@attach('paneManagerStore')
@view
export class SpaceNav extends React.Component<Props> {
  render() {
    const { paneManagerStore } = this.props
    const curIndex = Math.min(Math.max(0, paneManagerStore.paneIndex), AppPanes.length - 1)
    const activeItem = AppPanes[curIndex]
    return (
      <Interactive disabled={/^(settings|onboard)$/.test(paneManagerStore.activePane)}>
        <Row position="relative" zIndex={1000} padding={[2, 12]} alignItems="center">
          {/* 1px padding to center it for some reason... */}
          <View padding={[0, 10, 1, 4]}>
            <Icon size={16} name={activeItem.icon} />
          </View>
          <Row>
            {AppPanes.map((pane, index) => {
              const isActive = curIndex === index
              return (
                <Text
                  key={pane.title}
                  fontWeight={200}
                  size={1.05}
                  alpha={isActive ? 1 : 0.5}
                  alphaHover={isActive ? 1 : 0.7}
                  marginRight={4}
                  padding={[4, 8]}
                  onClick={paneManagerStore.activePaneSetter(index)}
                  transform={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -0.5 : 0,
                  }}
                >
                  {pane.title}
                </Text>
              )
            })}
          </Row>
          <View flex={1} minWidth={10} />
        </Row>
      </Interactive>
    )
  }
}

const Interactive = view({
  disabled: {
    opacity: 0,
    pointerEvents: 'none',
  },
})
