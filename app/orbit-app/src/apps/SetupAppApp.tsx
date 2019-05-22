import { App, AppIcon, createApp } from '@o/kit'
import {
  Button,
  List,
  ListItemProps,
  Section,
  Slider,
  SliderPane,
  Text,
  Title,
  Toolbar,
  View,
} from '@o/ui'
import React, { useState } from 'react'

import { useOm } from '../om/om'
import { getUserApps } from './orbitApps'

const descriptions = {
  search: 'Custom search with filters',
  lists: 'Controlled or controllable list',
  people: 'Manageable list of people',
  custom: 'Internal development test app',
  custom2: 'Internal development test app',
}

function SetupAppMain() {
  const { actions } = useOm()
  const items: ListItemProps[] = getUserApps().map(app => ({
    title: app.name,
    identifier: app.id,
    subTitle: app.description || 'No description',
    icon: <AppIcon app={{ identifier: app.id, colors: ['red', 'pink'] }} />,
    iconBefore: true,
    iconProps: {
      size: 44,
    },
  }))
  const [selected, setSelected] = useState<ListItemProps>(null)
  const [pane, setPane] = useState(0)

  const toolbars = [
    <>
      <Button
        alt="action"
        onClick={() => {
          setPane(1)
        }}
        icon="plus"
        tooltip="Create new custom app"
      >
        Create Custom App
      </Button>

      <View flex={1} />

      {selected && (
        <View minWidth={200} padding={[0, 30]} margin={[-10, 0]}>
          <Text fontWeight={600}>Add app to space</Text>
          <Text ellipse alpha={0.6} size={1.25}>
            {selected.title}
          </Text>
        </View>
      )}

      <Button
        size={1.4}
        alt="confirm"
        onClick={() => {
          actions.setupApp.create(selected.identifier)
        }}
        icon="chevron-right"
        tooltip="Create new custom app"
      >
        Add
      </Button>
    </>,

    <>
      <Button
        alt="action"
        iconAfter={false}
        icon="chevron-left"
        onClick={() => {
          setPane(0)
        }}
      >
        Back
      </Button>

      <View flex={1} />

      <Button
        size={1.4}
        alt="confirm"
        onClick={() => {
          actions.setupApp.create(selected.identifier)
        }}
        icon="chevron-right"
      >
        Start
      </Button>
    </>,
  ]

  return (
    <>
      <Slider curFrame={pane}>
        <SliderPane>
          <Section
            width="70%"
            background="transparent"
            margin="auto"
            height="80%"
            title="New app"
            bordered
            subTitle="Choose from your apps."
          >
            <List
              searchable
              selectable
              alwaysSelected
              onSelect={rows => setSelected(rows[0])}
              items={items}
            />
          </Section>
        </SliderPane>

        <SliderPane>
          <Section
            width="70%"
            background="transparent"
            margin="auto"
            height="70%"
            title="Create Custom App"
            bordered
            subTitle="Choose template"
          >
            <Title>hi</Title>
          </Section>
        </SliderPane>
      </Slider>

      <Toolbar size="md">{toolbars[pane]}</Toolbar>
    </>
  )
}

export default createApp({
  id: 'setupApp',
  name: 'Setup App',
  icon: '',
  app: () => (
    <App>
      <SetupAppMain />
    </App>
  ),
})
