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
            <Button
              key={`${filter.icon}${i}`}
              chromeless
              size={0.9}
              sizePadding={0.8}
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
            </Button>
          )
        })}
    </Row>
  )
})
