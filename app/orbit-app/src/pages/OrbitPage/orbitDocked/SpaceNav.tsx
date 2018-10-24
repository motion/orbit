import * as React from 'react'
import { view } from '@mcro/black'
import { PaneManagerStore } from '../PaneManagerStore'
import { View, Text, Row, Button } from '@mcro/ui'
import { SpaceStore } from '../../../stores/SpaceStore'

type Props = {
  spaceStore?: SpaceStore
  paneManagerStore?: PaneManagerStore
}

const SpaceNavAfter = view({
  position: 'absolute',
  top: 12,
  right: 8,
})

@view.attach('spaceStore', 'paneManagerStore')
@view
export class SpaceNav extends React.Component<Props> {
  render() {
    const { spaceStore, paneManagerStore } = this.props
    const newPane = spaceStore.panes.find(x => x.title === 'New')
    const activeItem = spaceStore.panes[paneManagerStore.paneIndex]
    const isHome = activeItem.title === 'Home'
    return (
      <View position="relative" zIndex={1000} padding={[8, 12, 0]}>
        <Row padding={[0, 2, 5]} alignItems="center">
          {activeItem.icon}
          <Text size={1.25} fontWeight={300} marginLeft={8} alpha={isHome ? 1 : 0.8}>
            Orbit
          </Text>

          <Text size={1.3} fontWeight={700} margin={[-4, 8, 0]}>
            {isHome ? '' : activeItem.title}
          </Text>
        </Row>
        <Row margin={-4}>
          {spaceStore.panes.filter(x => x.title !== 'New').map((pane, index) => (
            <Text
              key={pane.title}
              fontWeight={200}
              size={1.1}
              alpha={paneManagerStore.paneIndex === index ? 1 : 0.5}
              alphaHover={paneManagerStore.paneIndex === index ? 1 : 0.7}
              marginRight={6}
              padding={4}
              onClick={paneManagerStore.activePaneSetter(index)}
            >
              {pane.title}
            </Text>
          ))}
        </Row>

        <View flex={1} />

        <SpaceNavAfter>
          <Button borderWidth={0} glint={false} circular icon={newPane.icon} />
        </SpaceNavAfter>
      </View>
    )
  }
}
