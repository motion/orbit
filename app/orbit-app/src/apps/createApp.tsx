import { Row, View } from '@mcro/ui'
import React from 'react'
import { HorizontalSpace, Title } from '../views'
import { Icon } from '../views/Icon'
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
    return (
      <View padding={20}>
        <Row alignItems="center">
          <Icon name={props.appConfig.icon} size={32} />
          <HorizontalSpace />
          <Title margin={0}>New {props.appConfig.title} app</Title>
        </Row>
        {JSON.stringify(props.appConfig)}
      </View>
    )
  },
}
