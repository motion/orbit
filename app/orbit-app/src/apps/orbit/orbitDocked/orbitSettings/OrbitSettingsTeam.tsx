import * as React from 'react'
import { view } from '@mcro/black'
import { Title, HorizontalScroll, VerticalSpace } from '../../../../views'
import { SubTitle } from '../../../../views/SubTitle'
import { View, Icon } from '@mcro/ui'
import { Grid } from '../../../../views/Grid'
import { AppsStore } from '../../../AppsStore'
import { OrbitAppCard } from '../views/OrbitAppCard'
import { settingToAppConfig } from '../../../../helpers/toAppConfig/settingToAppConfig'
import { ToggleApp } from './ToggleApp'
import { OrbitOrb } from './OrbitOrb'

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

@view.attach('appsStore')
@view
export class OrbitSettingsTeam extends React.Component<{ appsStore?: AppsStore }> {
  render() {
    const { appsStore } = this.props
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
              <OrbitOrb bg={bg} color={color} />
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
          {appsStore.appsList.map((app, index) => (
            <OrbitAppCard
              key={app.id}
              model={app}
              pane="docked"
              subPane="apps"
              total={appsStore.appsList.length}
              inGrid
              result={{
                ...settingToAppConfig(app),
                config: {
                  dimensions: [680, 620],
                  initialState: {
                    active: 'settings',
                  },
                },
              }}
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
