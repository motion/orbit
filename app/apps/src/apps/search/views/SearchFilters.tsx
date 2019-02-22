import { ListItem, QueryStore } from '@mcro/kit'
import { Col, Icon } from '@mcro/ui'
import * as React from 'react'
import { useStores } from '../../../hooks/useStores'

type Props = {
  queryStore?: QueryStore
  width?: number
}

export default function SearchFilters(props: Props) {
  const { queryStore } = useStores()
  const { queryFilters } = queryStore
  if (!queryFilters.integrationFilters.length) {
    return null
  }
  return (
    <Col {...props}>
      {queryFilters.integrationFilters.map((filter, i) => {
        return (
          <ListItem
            key={`${filter.integration}${i}`}
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
  )
}
