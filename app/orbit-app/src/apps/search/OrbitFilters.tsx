import * as React from 'react'
import { view, compose, attach } from '@mcro/black'
import { Row, Button } from '@mcro/ui'
import { OrbitIcon } from '../../views/OrbitIcon'
import { QueryStore } from '../../stores/QueryStore/QueryStore'

type Props = {
  queryStore?: QueryStore
  forwardRef?: any
  width?: number
}

export const FilterButton = props => (
  <Button circular chromeless size={0.9} sizePadding={0.8} {...props} />
)

const decorate = compose(
  attach('queryStore'),
  view,
)
export const OrbitFilters = decorate(({ queryStore, ...props }: Props) => {
  const { queryFilters } = queryStore
  if (!queryFilters.integrationFilters.length) {
    return null
  }
  return (
    <Row {...props}>
      {queryFilters.integrationFilters.map((filter, i) => {
        return (
          <FilterButton
            key={`${filter.integration}${i}`}
            active={filter.active}
            onClick={queryFilters.integrationFilterToggler(filter)}
            tooltip={filter.name}
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
            <OrbitIcon name={filter.integration} size={16} />
          </FilterButton>
        )
      })}
    </Row>
  )
})
