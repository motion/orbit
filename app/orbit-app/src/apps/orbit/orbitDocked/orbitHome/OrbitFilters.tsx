import * as React from 'react'
import { view, compose } from '@mcro/black'
import { SearchStore } from '../SearchStore'
import { Row, Col, SearchInput } from '@mcro/ui'
import { RowItem } from '../../orbitHeader/RowItem'
import { RoundButton } from '../../../../views'

type Props = {
  searchStore?: SearchStore
  store?: OrbitFiltersStore
}

class OrbitFiltersStore {
  filterQuery = ''
  setQuery = e => (this.filterQuery = e.target.value)
}

const RowItemSmall = props => <RowItem padding={[1, 5]} {...props} />

const decorate = compose(
  view.attach({
    store: OrbitFiltersStore,
  }),
  view.attach('searchStore'),
  view,
)
export const OrbitFilters = decorate(({ searchStore, store }: Props) => {
  const { searchFilterStore } = searchStore
  // const hasActiveFilters = !!searchFilterStore.integrationFilters.find(x => x.active)
  return (
    <>
      <Row height={42} width="100%" alignItems="center" padding={[6, 6, 3, 6]}>
        <SearchInput padding={0} flex={1} onChange={store.setQuery} value={store.filterQuery} />
        {/* TODO once we have some filters toggled we can use this to clear all */}
        {false && <RoundButton icon="furniture_light" />}
      </Row>
      <Row flex={1}>
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
        </Col>
        <Col flex={1} overflowY="auto">
          <RowItemSmall title="#status" icon="check" />
          <RowItemSmall title="#general" />
          <RowItemSmall title="#revolution" />
          <RowItemSmall title="#something" />
        </Col>
      </Row>
    </>
  )
})
