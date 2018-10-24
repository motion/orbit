import * as React from 'react'
import { view } from '@mcro/black'
import { PaneManagerStore } from '../PaneManagerStore'
import { View, Text, Row, Button } from '@mcro/ui'
import { SpaceStore } from '../../../stores/SpaceStore'
import { Icon } from '../../../views/Icon'

type Props = {
  spaceStore?: SpaceStore
  paneManagerStore?: PaneManagerStore
}

const SpaceNavAfter = view({
  position: 'absolute',
  top: 12,
  right: 8,
})

export const SpaceNavHeight = () => <div style={{ height: 64, pointerEvents: 'none' }} />

@view.attach('spaceStore', 'paneManagerStore')
@view
export class SpaceNav extends React.Component<Props> {
  render() {
    const { spaceStore, paneManagerStore } = this.props
    const { activeSpace } = spaceStore
    const newPane = activeSpace.panes.find(x => x.title === 'New')
    const curIndex = Math.min(Math.max(0, paneManagerStore.paneIndex), activeSpace.panes.length - 1)
    const activeItem = activeSpace.panes[curIndex]
    // const isHome = activeItem.title === 'Home'
    return (
      <Row position="relative" zIndex={1000} padding={[8, 12]} alignItems="center">
        <View padding={[0, 10, 0, 0]}>
          <Icon size={18} name={activeItem.icon} />
        </View>
        {/* <Row padding={[0, 0, 7]} alignItems="center">
          <Text size={1.4} fontWeight={700} margin={[-4, isHome ? 0 : 7]} transform={{ y: -0.5 }}>
            {isHome ? 'Orbit' : activeItem.title}
          </Text>
        </Row> */}
        <Row>
          {spaceStore.activeSpace.panes.filter(x => x.title !== 'New').map((pane, index) => (
            <Text
              key={pane.title}
              fontWeight={200}
              size={1.1}
              alpha={curIndex === index ? 1 : 0.5}
              alphaHover={curIndex === index ? 1 : 0.7}
              marginRight={6}
              padding={4}
              onClick={paneManagerStore.activePaneSetter(index)}
              transform={{
                scale: curIndex === index ? 1.1 : 1,
              }}
              transition="transform ease-in 150ms"
            >
              {pane.title}
            </Text>
          ))}
        </Row>

        <View flex={1} />

        <SpaceNavAfter>
          <Button borderWidth={0} glint={false} circular icon={newPane.icon} />
        </SpaceNavAfter>
      </Row>
    )
  }
}
