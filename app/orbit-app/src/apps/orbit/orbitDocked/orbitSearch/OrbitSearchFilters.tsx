import './calendar.css' // theme css file
import * as React from 'react'
import { view, compose } from '@mcro/black'
import * as UI from '@mcro/ui'
import { RoundButton } from '../../../../views'
import { OrbitIcon } from '../../../../views/OrbitIcon'
import { DateRangePicker } from 'react-date-range'
import { SearchStore } from '../SearchStore'
import { NavButton } from '../../../../views/NavButton'
import { getDateAbbreviated } from '../orbitNav/getDateAbbreviated'

const SearchFilters = view(UI.Col, {
  padding: [0, 12],
})

const SearchFilterBar = view({
  flexFlow: 'row',
  padding: [6, 12],
  width: '100%',
  alignItems: 'center',
}).theme(({ theme }) => ({
  borderTop: [1, theme.borderColor.alpha(0.3)],
}))

const ExtraFilters = view(UI.View, {
  width: '100%',
  padding: [12, 0],
  opacity: 0,
  transition: 'all ease 50ms',
  visible: {
    opacity: 1,
    transition: 'all ease 100ms 50ms',
  },
})

type Props = {
  searchStore?: SearchStore
}

const IntegrationFiltersRow = view({
  flexFlow: 'row',
  alignItems: 'center',
  padding: 1,
})

const decorate = compose(
  view.attach('searchStore'),
  view,
)
export const OrbitSearchFilters = decorate(({ searchStore }: Props) => {
  const { searchFilterStore } = searchStore
  const hasActiveFilters = !!searchFilterStore.integrationFilters.find(x => x.active)
  return (
    <>
      <SearchFilterBar>
        <NavButton
          {...searchFilterStore.dateHover.props}
          active={searchFilterStore.dateHover.isStuck()}
        >
          {getDateAbbreviated(searchFilterStore.dateState) || 'Any time'}
        </NavButton>
        {/* <div style={{ width: 2 }} />
        <FilterButton onClick={searchFilterStore.toggleSortBy}>
          {searchFilterStore.sortBy}
        </FilterButton> */}
        <UI.Col flex={1} />
        {searchFilterStore.integrationFilters.length > 1 && (
          <IntegrationFiltersRow>
            {searchFilterStore.integrationFilters.map((filter, i) => {
              return (
                <RoundButton
                  key={`${filter.icon}${i}`}
                  circular
                  glint={false}
                  sizeHeight={0.9}
                  margin={[0, 3]}
                  icon={<OrbitIcon size={18} icon={filter.icon} />}
                  tooltip={filter.name}
                  onClick={searchFilterStore.integrationFilterToggler(filter)}
                  background="transparent"
                  transformOrigin="center center"
                  transition="transform ease 150ms"
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
                />
              )
            })}
          </IntegrationFiltersRow>
        )}
      </SearchFilterBar>
      <SearchFilters width="100%" alignItems="center">
        <ExtraFilters
          onMouseEnter={searchFilterStore.dateHover.props.onMouseEnter}
          onMouseLeave={searchFilterStore.dateHover.props.onMouseLeave}
          onMouseMove={searchFilterStore.dateHover.props.onMouseMove}
          className="calendar-dom"
          height={searchStore.searchFilterStore.extraFiltersHeight}
          visible={searchStore.searchFilterStore.extraFiltersVisible}
        >
          <DateRangePicker
            onChange={searchFilterStore.onChangeDate}
            ranges={[searchFilterStore.dateState]}
          />
        </ExtraFilters>
      </SearchFilters>
    </>
  )
})
