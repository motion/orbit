import { App } from '@mcro/models'
import { IconProps, Row, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { HorizontalSpace, SubTitle, Title, VerticalSpace } from '../../views'
import { ColorPicker } from '../../views/ColorPicker'
import { Icon } from '../../views/Icon'
import { Input } from '../../views/Input'

export function AppIcon({ app, ...props }: { app: App } & Partial<IconProps>) {
  return <Icon background={app.colors[0]} name={`orbit-${app.type}-full`} size={48} {...props} />
}

export default observer(function AppsMainNew() {
  const { newAppStore } = useStoresSafe()
  const { app } = newAppStore

  return (
    <View padding={15}>
      <Row alignItems="center">
        <Icon background={app.colors[0]} name={`orbit-${app.type}-full`} size={48} />

        <HorizontalSpace />
        <Title margin={0}>{app.name}</Title>

        {/* <View flex={1} />
        <Theme name="selected">
          <Button disabled={!app.name} elevation={1} size={1.4}>
            Save
          </Button>
        </Theme> */}
      </Row>

      <VerticalSpace />

      <SubTitle>Name</SubTitle>
      <Input
        placeholder="Name..."
        value={app.name}
        onChange={e => {
          newAppStore.update({ name: e.target.value })
        }}
      />

      <VerticalSpace />

      <View>
        <ColorPicker
          onChangeColor={color => {
            newAppStore.update({ colors: [color, 'white'] })
          }}
          activeColor={app.colors[0]}
        />
      </View>
    </View>
  )
})
