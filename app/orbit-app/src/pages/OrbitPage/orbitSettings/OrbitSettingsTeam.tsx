import * as React from 'react'
import { view, attach } from '@mcro/black'
import { Title, HorizontalScroll, VerticalSpace } from '../../../views'
import { SubTitle } from '../../../views/SubTitle'
import { View, Icon } from '@mcro/ui'
import { Grid } from '../../../views/Grid'
import { SourcesStore } from '../../../stores/SourcesStore'
import { OrbitAppCard } from '../../../components/OrbitAppCard'
import { ToggleApp } from './ToggleApp'
import { OrbitOrb } from '../../../views/OrbitOrb'
import { PaneManagerStore } from '../../../stores/PaneManagerStore'

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

@attach('paneManagerStore', 'sourcesStore')
@view
export class OrbitSettingsTeam extends React.Component<{
  sourcesStore?: SourcesStore
  paneManagerStore?: PaneManagerStore
}> {
  isSubPaneSelected = () => this.props.paneManagerStore.subPane === 'apps'

  render() {
    const { sourcesStore } = this.props
    return (
      <>
        <SubTitle>Spaces</SubTitle>
        <HorizontalScroll height={84}>
          <ToggleApp
            appConfig={{
              type: 'view',
              id: 'confluence',
              subType: 'NewOrbitPane',
              title: 'New Orbit',
              icon: 'orbit',
            }}
          >
            <OrbitSpaceCard label="New">
              <View width={32} height={32} alignItems="center" justifyContent="center">
                <Icon name="add" size={10} />
              </View>
            </OrbitSpaceCard>
          </ToggleApp>
          {[
            { bg: '#333', color: '#fff', name: 'Me' },
            { bg: '#222', color: '#985FC9', name: 'Orbit', active: true },
          ].map(({ bg, color, name, active }, i) => (
            <OrbitSpaceCard key={i} active={active} label={name}>
              <OrbitOrb background={bg} color={color} />
            </OrbitSpaceCard>
          ))}
        </HorizontalScroll>
        <VerticalSpace />
        <Title>Orbit</Title>
        <Grid
          gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))"
          gridAutoRows={80}
          margin={[5, -4]}
        >
          {sourcesStore.activeSources.map((app, index) => (
            <OrbitAppCard
              key={index}
              app={app}
              total={sourcesStore.activeSources.length}
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
    )
  }
}
