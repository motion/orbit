import { gloss } from '@mcro/gloss'
import { Button, Row, Text, Theme, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { HorizontalSpace, SubTitle, Title, VerticalSpace } from '../views'
import { Divider } from '../views/Divider'
import { Icon } from '../views/Icon'
import { Input } from '../views/Input'

const apps = [
  {
    title: 'Search',
    icon: 'orbitSearch',
    subtitle: 'Custom search pane',
    type: 'search',
  },
  {
    title: 'List',
    icon: 'orbitLists',
    subtitle: 'Custom list pane',
    type: 'lists',
  },
  {
    title: 'Directory',
    icon: 'orbitPeople',
    subtitle: 'Filtered people app',
    type: 'people',
  },
]

export const createApp = {
  main: observer(function CreateAppMain() {
    const { newAppStore } = useStoresSafe()
    const { type } = newAppStore
    const app = apps.find(x => x.type === type)
    return (
      <View padding={20} margin="auto" width="80%" minHeight="80%" minWidth={400} maxWidth={700}>
        <Row alignItems="center">
          <Icon name={app.icon} size={32} />
          <HorizontalSpace />
          <Title margin={0}>{newAppStore.name}</Title>

          <View flex={1} />
          <Theme name="selected">
            <Button disabled={!newAppStore.name} elevation={1} size={1.4}>
              Save
            </Button>
          </Theme>
        </Row>

        <VerticalSpace />

        <SubTitle>Name</SubTitle>
        <Input
          placeholder="Name..."
          value={newAppStore.name}
          onChange={e => {
            newAppStore.setName(e.target.value)
          }}
        />

        <VerticalSpace />

        <SubTitle>Type</SubTitle>
        <Row>
          {apps.map((app, index) => (
            <View key={index} alignItems="center" marginRight={12}>
              <Theme name={app.type === type ? 'selected' : null}>
                <IconSelect onClick={() => newAppStore.setType(app.type)}>
                  <Icon name={app.icon} />
                </IconSelect>
              </Theme>
              <Text marginTop={5} ellipse size={0.9} fontWeight={500} alpha={0.8}>
                {app.title}
              </Text>
            </View>
          ))}
        </Row>

        <VerticalSpace />
        <Divider />
        <VerticalSpace />

        <SubTitle>Setup</SubTitle>
      </View>
    )
  }),
}

const IconSelect = gloss({
  padding: 10,
  borderRadius: 8,
}).theme((_, theme) => ({
  background: theme.background,
  boxShadow: [
    ['inset', 0, 0, 0, 0.5, theme.borderColor.alpha(0.5)],
    [0, 0, 0, 3, theme.borderColor.alpha(0.25)],
  ],
  '&:hover': {
    background: theme.backgroundHover,
  },
}))
