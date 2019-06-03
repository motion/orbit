import { Button, Col, ListItem, Popover, Text, View, ViewProps, Icon } from '@o/ui'
import React from 'react'
import { useStores } from '../hooks/useStores'
import { QueryFilterStore } from '../stores/QueryFilterStore'

export function AppFilterButton(props: ViewProps & { queryFilterStore?: QueryFilterStore }) {
  const stores = useStores()
  const queryFilterStore = props.queryFilterStore || stores.queryStore.queryFilters
  const { appFilters, sourceFilterToggler } = queryFilterStore
  return (
    <Popover
      openOnClick
      closeOnClickAway
      background
      borderRadius={10}
      elevation={4}
      popoverTheme="tooltip"
      target={<Button tooltip="Filter by app" icon="filter" />}
    >
      <Col {...props}>
        {!appFilters.length && (
          <View padding={20} alignItems="center" justifyContent="center">
            <Text>No data sources.</Text>
          </View>
        )}
        {appFilters.map(filter => {
          return (
            <ListItem
              key={filter.id}
              width={200}
              onClick={sourceFilterToggler(filter)}
              icon={filter.app}
              titleProps={{
                fontWeight: 300,
              }}
              title={filter.name}
              after={
                filter.active ? <Icon margin="auto" name="check" color="#3AD052" size={10} /> : null
              }
            />
          )
        })}
      </Col>
    </Popover>
  )
}
