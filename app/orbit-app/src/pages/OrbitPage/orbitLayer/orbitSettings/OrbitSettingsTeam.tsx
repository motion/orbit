import * as React from 'react'
import { view, attach } from '@mcro/black'
import { SpaceStore } from '../../../../stores/SpaceStore'
import { Title, HorizontalScroll, VerticalSpace } from '../../../../views'
import { SubTitle } from '../../../../views/SubTitle'
import { View, Icon } from '@mcro/ui'
import { Grid } from '../../../../views/Grid'
import { OrbitAppCard } from '../../../../components/OrbitAppCard'
import { ToggleApp } from './ToggleApp'
import { OrbitOrb } from '../../../../views/OrbitOrb'
import { PaneManagerStore } from '../../../../stores/PaneManagerStore'

const OrbitSpaceCardFrame = view({
  borderRadius: 6,
  padding: [10, 18],
  marginRight: 6,
  alignItems: 'center',
  justifyContent: 'center',
  background: [0, 0, 0, 0],
  '&:hover': {
    background: [0, 0, 0, 0.05],
  },
  active: {
    background: [0, 0, 0, 0.1],
  },
})

const OrbitSpaceCard = ({ children, label, active = false, ...props }) => (
  <OrbitSpaceCardFrame active={active} {...props}>
    <View width={32} height={32} alignItems="center" justifyContent="center">
      {children}
    </View>
    <SubTitle size={0.9} fontWeight={500}>
      {label}
    </SubTitle>
  </OrbitSpaceCardFrame>
)

@attach('paneManagerStore', 'spaceStore')
@view
export class OrbitSettingsTeam extends React.Component<{
  spaceStore?: SpaceStore
  paneManagerStore?: PaneManagerStore
}> {
  isSubPaneSelected = () => this.props.paneManagerStore.subPane === 'apps'

  render() {
    const { spaceStore } = this.props
    return (
      <>
        <SubTitle>Spaces</SubTitle>
        <HorizontalScroll height={84}>
          <ToggleApp
            appConfig={{
              type: 'newSpace',
              title: 'New Space',
              icon: 'orbit',
            }}
          >
            <OrbitSpaceCard label="New">
              <View width={32} height={32} alignItems="center" justifyContent="center">
                <Icon name="add" size={10} />
              </View>
            </OrbitSpaceCard>
          </ToggleApp>
          {spaceStore.spaces.map((space, i) => (
            <OrbitSpaceCard onClick={() => spaceStore.activeIndex = i} key={i} active={spaceStore.activeIndex === i} label={space.name}>
              <OrbitOrb background={space.colors[0] || '#EEE'} color={space.colors[1] || '#333'} />
            </OrbitSpaceCard>
          ))}
        </HorizontalScroll>
        <VerticalSpace />
        {spaceStore.activeSortedSpaces.map(space => (
          <>
            <Title>{space.name}</Title>
            <Grid
              gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))"
              gridAutoRows={80}
              margin={[5, -4]}
            >
              {spaceStore.spaceSources(space).map((app, index) => (
                <OrbitAppCard
                  key={index}
                  app={app}
                  total={spaceStore.spaceSources(space).length}
                  inGrid
                  activeCondition={this.isSubPaneSelected}
                  pane="docked"
                  subPane="apps"
                  index={index}
                  isActive
                />
              ))}
            </Grid>
            <VerticalSpace />
          </>
        ))}
      </>
    )
  }
}
