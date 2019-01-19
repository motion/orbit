import { Button, Col } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useStoresSafe } from '../../../hooks/useStoresSafe'
import { QueryStore } from '../../../stores/QueryStore/QueryStore'
import { Icon } from '../../../views/Icon'

type Props = {
  queryStore?: QueryStore
  forwardRef?: any
  width?: number
}

export const FilterButton = props => <Button chromeless size={0.9} sizePadding={0.8} {...props} />

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
          <FilterButton
            key={`${filter.integration}${i}`}
            active={filter.active}
            onClick={queryFilters.integrationFilterToggler(filter)}
            tooltip={filter.name}
            icon={<Icon name={filter.integration} size={16} />}
            {...filter.active && {
              opacity: 1,
            }}
            {...!filter.active && {
              opacity: 0.5,
            }}
            hoverStyle={{
              opacity: filter.active ? 1 : 0.75,
            }}
            activeStyle={{
              opacity: 1,
            }}
          >
            {filter.name}
          </FilterButton>
        )
      })}
    </Col>
  )
})
