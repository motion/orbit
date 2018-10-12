import * as React from 'react'
import { view, compose } from '@mcro/black'
import { SearchStore } from '../SearchStore'
import { Row } from '@mcro/ui'
import { RowItem } from '../../orbitHeader/RowItem'

type Props = {
  searchStore?: SearchStore
  forwardRef?: any
  width?: number
}

const decorate = compose(
  view.attach('searchStore'),
  view,
)
export const OrbitFilters = decorate(({ searchStore, ...props }: Props) => {
  const { searchFilterStore } = searchStore
  // const hasActiveFilters = !!searchFilterStore.integrationFilters.find(x => x.active)
  return (
    <Row {...props}>
      {searchFilterStore.integrationFilters.length > 1 &&
        searchFilterStore.integrationFilters.map((filter, i) => {
          return (
            <RowItem
              key={`${filter.icon}${i}`}
              icon={filter.icon}
              onClick={searchFilterStore.integrationFilterToggler(filter)}
              {...filter.active && {
                opacity: 1,
              }}
              {...!filter.active && {
                opacity: 0.5,
              }}
              activeStyle={{
                background: 'transparent',
              }}
              hoverStyle={{
                filter: 'none',
                opacity: filter.active ? 1 : 0.75,
              }}
            >
              {filter.name}
            </RowItem>
          )
        })}
    </Row>
  )
})
