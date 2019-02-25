import { BarButtonSmall, Col, ListItem, Popover, Text, View, ViewProps } from '@mcro/ui'
import React from 'react'
import { useStores } from '../hooks/useStores'
import { QueryFilterStore } from '../stores/QueryFilterStore'
import { Icon } from './Icon'

export function SourceFilterButton(props: ViewProps & { queryFilterStore?: QueryFilterStore }) {
  const stores = useStores()
  const queryFilterStore = props.queryFilterStore || stores.queryStore.queryFilters
  const { /* hasSourceFilters,  */ sourceFilters, sourceFilterToggler } = queryFilterStore
  return (
    <Popover
      openOnClick
      closeOnClickAway
      group="filters"
      background
      borderRadius={10}
      elevation={4}
      themeName="tooltip"
      target={
        <BarButtonSmall icon="funnel">
          {/* {hasSourceFilters ? sourceFilters.filter(x => x.active).length : 'All'} */}
        </BarButtonSmall>
      }
    >
      <Col {...props}>
        {!sourceFilters.length && (
          <View padding={20} alignItems="center" justifyContent="center">
            <Text>No data sources.</Text>
          </View>
        )}
        {sourceFilters.map(filter => {
          return (
            <ListItem
              key={filter.id}
              width={200}
              onClick={sourceFilterToggler(filter)}
              icon={filter.source}
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
