import * as React from 'react'
import { view, compose } from '@mcro/black'
import { SearchStore } from '../SearchStore'
import { Row, Button } from '@mcro/ui'
import { OrbitIcon } from '../../../../views/OrbitIcon'

type Props = {
  searchStore?: SearchStore
  forwardRef?: any
  width?: number
}

const FilterButton = props => <Button chromeless size={0.9} sizePadding={0.8} {...props} />

const decorate = compose(
  view.attach('searchStore'),
  view,
)
export const OrbitFilters = decorate(({ searchStore, ...props }: Props) => {
  const { searchFilterStore } = searchStore
  return (
    <Row {...props}>
      <FilterButton
        onClick={searchFilterStore.toggleSortBy}
        opacity={0.8}
        iconProps={{
          size: 14,
        }}
        icon={searchFilterStore.sortBy === 'Recent' ? 'clock' : 'target'}
        tooltip={searchFilterStore.sortBy}
      />
      {searchFilterStore.integrationFilters.length > 1 &&
        searchFilterStore.integrationFilters.map((filter, i) => {
          return (
            <FilterButton
              key={`${filter.icon}${i}`}
              active={filter.active}
              onClick={searchFilterStore.integrationFilterToggler(filter)}
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
              <OrbitIcon name={filter.icon} size={18} />
            </FilterButton>
          )
        })}
    </Row>
  )
})
