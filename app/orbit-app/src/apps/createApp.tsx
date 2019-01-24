import { Absolute, Button, Row, Theme, View } from '@mcro/ui'
import React from 'react'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { HorizontalSpace, SubTitle, Title, VerticalSpace } from '../views'
import { Icon } from '../views/Icon'
import { Input } from '../views/Input'
import SelectableList from '../views/Lists/SelectableList'

export const createApp = {
  index: () => {
    return (
      <SelectableList
        minSelected={0}
        items={[
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
        ]}
      />
    )
  },
  main: props => {
    const { newAppStore } = useStoresSafe()

    if (!props.appConfig) {
      return null
    }
    return (
      <View padding={20}>
        <Row alignItems="center">
          <Icon name={props.appConfig.icon} size={32} />
          <HorizontalSpace />
          <Title margin={0}>Setup</Title>
        </Row>

        <VerticalSpace />

        <SubTitle>Name</SubTitle>
        <Input
          placeholder="Name..."
          onChange={e => {
            newAppStore.setName(e.target.value)
          }}
        />

        <Absolute top={20} right={20}>
          <Theme name="selected">
            <Button elevation={1} size={1.2}>
              Create {props.appConfig.title.toLowerCase()} app
            </Button>
          </Theme>
        </Absolute>
      </View>
    )
  },
}
