import { Col } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useStoresSafe } from '../../../hooks/useStoresSafe'
import { QueryStore } from '../../../stores/QueryStore/QueryStore'
import { Icon } from '../../../views/Icon'
import ListItem from '../../../views/ListItems/ListItem'

type Props = {
  queryStore?: QueryStore
  forwardRef?: any
  width?: number
}

export default observer(function SearchFilters(props: Props) {
  const { queryStore } = useStoresSafe()
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
})
