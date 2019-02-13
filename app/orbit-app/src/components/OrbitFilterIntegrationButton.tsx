import { Col, Popover, ViewProps } from '@mcro/ui'
import React from 'react'
import { useStores } from '../hooks/useStores'
import { QueryFilterStore } from '../stores/QueryStore/QueryFiltersStore'
import { FloatingBarButton } from '../views/FloatingBar/FloatingBarButton'
import { Icon } from '../views/Icon'
import ListItem from '../views/ListItems/ListItem'

export default function OrbitFilterIntegrationButton(
  props: ViewProps & { queryFilterStore?: QueryFilterStore },
) {
  const stores = useStores()
  const queryFilterStore = props.queryFilterStore || stores.queryStore.queryFilters
  const { hasIntegrationFilters, integrationFilters, integrationFilterToggler } = queryFilterStore
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
        <FloatingBarButton icon="funnel">
          {hasIntegrationFilters ? integrationFilters.filter(x => x.active).length : 'All'}
        </FloatingBarButton>
      }
    >
      <Col {...props}>
        {integrationFilters.map(filter => {
          return (
            <ListItem
              key={filter.id}
              width={200}
              onClick={integrationFilterToggler(filter)}
              icon={filter.integration}
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
