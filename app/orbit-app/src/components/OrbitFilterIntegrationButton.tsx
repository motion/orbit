import { Col, Popover, ViewProps } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { FloatingButton } from '../views/FloatingBar/FloatingButton'
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
        <FloatingButton icon="funnel" width={46}>
          {queryFilters.hasIntegrationFilters
            ? queryFilters.integrationFilters.filter(x => x.active).length
            : 'All'}
        </FloatingButton>
      }
    >
      <Col {...props}>
        {queryFilters.integrationFilters.map(filter => {
          return (
            <ListItem
              key={filter.id}
              width={200}
              onClick={queryFilters.integrationFilterToggler(filter)}
              icon={<Icon name={filter.integration} size={16} /> as any}
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
