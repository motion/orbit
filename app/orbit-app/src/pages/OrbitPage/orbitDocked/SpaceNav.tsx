import * as React from 'react'
import { view, attach } from '@mcro/black'
import { PaneManagerStore } from '../PaneManagerStore'
import { View, Text, Row, Button } from '@mcro/ui'
import { OrbitStore } from '../../../stores/OrbitStore'
import { Icon } from '../../../views/Icon'

type Props = {
  orbitStore?: OrbitStore
  paneManagerStore?: PaneManagerStore
}

export const SpaceNavHeight = () => <div style={{ height: 42, pointerEvents: 'none' }} />

@attach('orbitStore', 'paneManagerStore')
@view
export class SpaceNav extends React.Component<Props> {
  render() {
    const { orbitStore, paneManagerStore } = this.props
    const { activeSpace } = orbitStore
    const newPane = activeSpace.panes.find(x => x.title === 'New')
    const curIndex = Math.min(Math.max(0, paneManagerStore.paneIndex), activeSpace.panes.length - 1)
    const activeItem = activeSpace.panes[curIndex]
    return (
      <Row position="relative" zIndex={1000} padding={[3, 12]} alignItems="center">
        {/* 1px padding to center it for some reason... */}
        <View padding={[0, 12, 1, 2]}>
          <Icon size={16} name={activeItem.icon} />
        </View>
        <Row>
          {orbitStore.activeSpace.panes.filter(x => x.title !== 'New').map((pane, index) => {
            const isActive = curIndex === index
            return (
              <Text
                key={pane.title}
                fontWeight={200}
                size={1.1}
                alpha={isActive ? 1 : 0.5}
                alphaHover={isActive ? 1 : 0.7}
                marginRight={8}
                padding={4}
                onClick={paneManagerStore.activePaneSetter(index)}
                transform={{
                  scale: isActive ? 1.15 : 1,
                  y: isActive ? -0.5 : 0,
                }}
              >
                {pane.title}
              </Text>
            )
          })}
        </Row>
        <View flex={1} minWidth={10} />
        <Button
          borderWidth={0}
          glint={false}
          circular
          icon={<Icon size={16} name={newPane.icon} />}
          onClick={paneManagerStore.activePaneSetter(paneManagerStore.panes.indexOf('new'))}
        />
      </Row>
    )
  }
}
