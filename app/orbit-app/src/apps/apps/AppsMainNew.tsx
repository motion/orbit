import { App } from '@mcro/models'
import { Button, IconProps, Row, Text, Theme, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { HorizontalSpace, SubTitle, Title, VerticalSpace } from '../../views'
import { ColorPicker } from '../../views/ColorPicker'
import { Icon } from '../../views/Icon'
import { IconContainer } from '../../views/IconContainer'
import { Input } from '../../views/Input'

const defaultApps: App[] = [
  {
    target: 'app',
    name: 'Search',
    type: 'search',
    colors: ['red'],
    data: {},
  },
  {
    target: 'app',
    name: 'List',
    type: 'lists',
    colors: ['blue'],
    data: {
      rootItemID: 0,
      items: {},
    },
  },
  {
    target: 'app',
    name: 'Directory',
    type: 'people',
    colors: ['green'],
    data: {},
  },
]

function AppIcon({ app, ...props }: { app: App } & Partial<IconProps>) {
  return <Icon background={app.colors[0]} name={`orbit-${app.type}-full`} size={48} {...props} />
}

export default observer(function AppsMainNew() {
  const { newAppStore } = useStoresSafe()
  const { type } = newAppStore
  const [app, setApp] = useState<App>(null)

  useEffect(
    () => {
      const nextApp = defaultApps.find(x => x.type === type)
      console.log('nextApp', nextApp)
      setApp(nextApp)
    },
    [type],
  )

  if (!app) {
    return null
  }

  return (
    <>
      <SubTitle>Type</SubTitle>
      <Row>
        {defaultApps.map((app, index) => (
          <View key={index} alignItems="center" marginRight={12}>
            <Theme name={app.type === type ? 'selected' : null}>
              <IconContainer onClick={() => newAppStore.setType(app.type)}>
                <AppIcon app={app} />
              </IconContainer>
            </Theme>
            <Text marginTop={5} ellipse size={0.9} fontWeight={500} alpha={0.8}>
              {app.name}
            </Text>
          </View>
        ))}
      </Row>

      <AppsMainNewSetup app={app} />
    </>
  )
})

const AppsMainNewSetup = observer(function AppsMainNewSetup({
  app,
  ...props
}: {
  app: App
  changeColor?: (color: string) => any
}) {
  const { newAppStore } = useStoresSafe()

  return (
    <View padding={20} margin="auto" width="80%" minHeight="80%" minWidth={400} maxWidth={700}>
      {/* header */}
      <Row alignItems="center">
        <Icon background={app.colors[0]} name={`orbit-${app.type}-full`} size={48} />

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
        <ColorPicker onChangeColor={props.changeColor} activeColor={app.colors[0]} />
      </View>
    </View>
  )
})
