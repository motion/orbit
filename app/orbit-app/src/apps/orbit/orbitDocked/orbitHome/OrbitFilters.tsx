import * as React from 'react'
import { view, compose } from '@mcro/black'
import { SearchStore } from '../SearchStore'
import { Row, Col, SearchInput } from '@mcro/ui'
import { RowItem } from '../../orbitHeader/RowItem'

type Props = {
  searchStore?: SearchStore
}

const decorate = compose(
  view.attach('searchStore'),
  view,
)
export const OrbitFilters = decorate(({ searchStore }: Props) => {
  const { searchFilterStore } = searchStore
  const hasActiveFilters = !!searchFilterStore.integrationFilters.find(x => x.active)
  return (
    <>
      <SearchInput />
      <Row>
        <Col>
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
                  {...hasActiveFilters &&
                    !filter.active && {
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
        </Col>
        <Col>
          <RowItem title="#status" />
          <RowItem title="#general" />
          <RowItem title="#revolution" />
          <RowItem title="#something" />
        </Col>
      </Row>
    </>
  )
})
