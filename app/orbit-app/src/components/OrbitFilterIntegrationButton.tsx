import { Col, Popover, ViewProps } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { FloatingBarButtonSmall } from '../views/FloatingBar/FloatingBarButtonSmall'
import { Icon } from '../views/Icon'
import ListItem from '../views/ListItems/ListItem'

export default observer(function OrbitFilterIntegrationButton(props: ViewProps) {
  const { queryStore } = useStoresSafe()
  const { queryFilters } = queryStore
  return (
    <Popover
      delay={250}
      openOnClick
      openOnHover
      closeOnClickAway
      group="filters"
      background
      borderRadius={6}
      elevation={4}
      theme="light"
      target={
        <FloatingBarButtonSmall icon="funnel" width={46}>
          {queryFilters.hasIntegrationFilters
            ? queryFilters.integrationFilters.filter(x => x.active).length
            : 'All'}
        </FloatingBarButtonSmall>
      }
    >
      <Col {...props}>
        {queryFilters.integrationFilters.map(filter => {
          return (
            <ListItem
              key={filter.id}
              width={200}
              onClick={queryFilters.integrationFilterToggler(filter)}
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
})
