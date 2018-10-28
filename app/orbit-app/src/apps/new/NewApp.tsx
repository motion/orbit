import * as React from 'react'
import { view, attach } from '@mcro/black'
import { SettingStore } from '../../stores/SettingStore'
import { SliderPane, Slider } from '../../views/Slider'
import { Title } from '../../views'
import { Grid, Text, Col, Theme, Button } from '@mcro/ui'
import { OrbitCard } from '../../views/OrbitCard'
import { AppListSetup } from './AppListSetup'
import { BottomControls } from '../../views/BottomControls'

type Props = {
  settingStore?: SettingStore
}

class MeStore {
  props: Props
  activeApp = -1

  get activeAppName() {
    if (this.activeApp > -1) {
      return this.apps[this.activeApp].title
    }
    return ''
  }

  setActiveApp = index => {
    this.activeApp = index
  }

  goBack = () => {
    this.activeApp--
  }

  apps = [
    {
      title: 'List',
      icon: 'list',
      description: `Organizable list you sort and control how it looks.`,
    },
    {
      title: 'Item',
      icon: 'item',
      description: `Show the content of a single bit.`,
    },
    {
      title: 'Search',
      icon: 'zoom',
      description: `Show the results of a search as a list.`,
    },
    {
      title: 'Search List',
      icon: 'zoom',
      description: `Horizontal list of queries you organize and pin.`,
    },
    {
      title: 'Topic List',
      icon: 'chat',
      description: `Custom list of topics that lead into searches.`,
    },
    {
      title: 'Directory',
      icon: 'index',
      description: `Directory of People or Lists for navigation.`,
    },
  ]
}

const Pane = props => <SliderPane padding={[20, 14, 40]} {...props} />

@attach('settingStore')
@attach({
  store: MeStore,
})
@view
export class NewApp extends React.Component<Props & { store?: MeStore }> {
  render() {
    const { store } = this.props
    return (
      <>
        <Slider curFrame={store.activeApp + 1}>
          <Pane>
            <Title>Add app</Title>
            <Grid
              gridTemplateColumns="repeat(auto-fill, minmax(180px, 1fr))"
              gridAutoRows={90}
              gridGap={6}
              margin={[5, -4]}
            >
              {store.apps.map((item, index) => (
                <OrbitCard
                  key={index}
                  titleProps={{ fontSize: 18, fontWeight: 300 }}
                  title={item.title}
                  icon={item.icon}
                  inGrid
                  direct
                  index={index}
                  onSelect={store.setActiveApp}
                >
                  <Text size={1.15} alpha={0.6}>
                    {item.description}
                  </Text>
                </OrbitCard>
              ))}
            </Grid>
          </Pane>

          <Pane>
            <Title>New {store.activeAppName.toLowerCase()}</Title>
            {store.activeAppName === 'List' && <AppListSetup />}
          </Pane>
        </Slider>

        <BottomControls invisible={store.activeApp === -1}>
          {store.activeApp > -1 && (
            <Button chromeless onClick={store.goBack}>
              Back
            </Button>
          )}
          <Col flex={1} />
          <Theme name="orbit">
            <Button>Create</Button>
          </Theme>
        </BottomControls>
      </>
    )
  }
}
