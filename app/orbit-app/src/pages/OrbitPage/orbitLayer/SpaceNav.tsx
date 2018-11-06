import * as React from 'react'
import { view, attach } from '@mcro/black'
import { View, Text, Row } from '@mcro/ui'
import { OrbitStore } from '../../../stores/OrbitStore'
import { Icon } from '../../../views/Icon'
import { PaneManagerStore } from '../../../stores/PaneManagerStore'

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
    const curIndex = Math.min(Math.max(0, paneManagerStore.paneIndex), activeSpace.panes.length - 1)
    const activeItem = activeSpace.panes[curIndex]
    return (
      <Interactive disabled={/^(settings|onboard)$/.test(paneManagerStore.activePane)}>
        <Row position="relative" zIndex={1000} padding={[2, 12]} alignItems="center">
          {/* 1px padding to center it for some reason... */}
          <View padding={[0, 10, 1, 4]}>
            <Icon size={16} name={activeItem.icon} />
          </View>
          <Row>
            {orbitStore.activeSpace.panes.map((pane, index) => {
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
          {/* <Button
          borderWidth={0}
          glint={false}
          circular
          icon={<Icon size={16} name={newPane.icon} />}
          onClick={paneManagerStore.activePaneSetter(paneManagerStore.panes.indexOf('new'))}
        /> */}
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
