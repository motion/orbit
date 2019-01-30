import { Button, Row, Text, Theme, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { HorizontalSpace, SubTitle, Title, VerticalSpace } from '../views'
import { ColorPicker } from '../views/ColorPicker'
import { Divider } from '../views/Divider'
import { Icon } from '../views/Icon'
import { IconContainer } from '../views/IconContainer'
import { Input } from '../views/Input'

const apps = [
  {
    title: 'Search',
    icon: 'orbit-search',
    subtitle: 'Custom search pane',
    type: 'search',
  },
  {
    title: 'List',
    icon: 'orbit-lists',
    subtitle: 'Custom list pane',
    type: 'lists',
  },
  {
    title: 'Directory',
    icon: 'orbit-people',
    subtitle: 'Filtered people app',
    type: 'people',
  },
]

const CreateAppMain = observer(function CreateAppMain() {
  const { newAppStore } = useStoresSafe()
  const { type } = newAppStore
  const app = apps.find(x => x.type === type)
  const [background, setBackground] = useState('#111')

  console.log('app.icon', app.icon)

  return (
    <View padding={20} margin="auto" width="80%" minHeight="80%" minWidth={400} maxWidth={700}>
      {/* header */}
      <Row alignItems="center">
        <Icon background={background} name={`${app.icon}-full`} size={48} />

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

      <View>
        <ColorPicker onChange={setBackground} />
      </View>
      <VerticalSpace />

      <SubTitle>Type</SubTitle>
      <Row>
        {apps.map((app, index) => (
          <View key={index} alignItems="center" marginRight={12}>
            <Theme name={app.type === type ? 'selected' : null}>
              <IconContainer onClick={() => newAppStore.setType(app.type)}>
                <Icon name={app.icon} />
              </IconContainer>
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
})

export const createApp = {
  main: CreateAppMain,
}
