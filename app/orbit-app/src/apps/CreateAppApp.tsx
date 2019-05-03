import { App, AppIcon, createApp } from '@o/kit'
import { Button, List, Section, Slider, SliderPane, Text, Title, Toolbar, View } from '@o/ui'
import React, { useState } from 'react'

import { useActions } from '../hooks/useActions'
import { defaultApps } from '../stores/NewAppStore'

const descriptions = {
  search: 'Custom search with filters',
  lists: 'Controlled or controllable list',
  people: 'Manageable list of people',
  custom: 'Internal development test app',
  custom2: 'Internal development test app',
}

function CreateAppMain() {
  const Actions = useActions()
  const items = defaultApps.map(app => ({
    title: app.name,
    identifier: app.identifier,
    subTitle: descriptions[app.identifier],
    icon: <AppIcon app={app} />,
    iconBefore: true,
    iconProps: {
      size: 44,
    },
  }))
  const [selected, setSelected] = useState<typeof items[0]>(null)
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
          Actions.createCustomApp(selected.identifier)
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
          Actions.createCustomApp(selected.identifier)
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
            height="70%"
            title="New app"
            bordered
            subTitle="Choose an app from your library to add to space."
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
  id: 'createApp',
  name: 'Create App',
  icon: '',
  app: () => (
    <App>
      <CreateAppMain />
    </App>
  ),
})
