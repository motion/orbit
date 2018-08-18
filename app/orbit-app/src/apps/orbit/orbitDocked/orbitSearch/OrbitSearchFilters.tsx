import 'react-date-range/dist/styles.css' // main style file
import './calendar.css' // theme css file
import * as React from 'react'
import { view, compose } from '@mcro/black'
import * as UI from '@mcro/ui'
import { RoundButton } from '../../../../views'
import { OrbitIcon } from '../../../../views/OrbitIcon'
import { DateRangePicker } from 'react-date-range'
import { formatDistance } from 'date-fns'
import { SearchStore } from '../../../../stores/SearchStore'
import { IntegrationSettingsStore } from '../../../../stores/IntegrationSettingsStore'

const SearchFilters = view(UI.Col, {
  padding: [7, 12],
})

const SearchFilterBar = view({
  flexFlow: 'row',
  padding: [0, 8],
  width: '100%',
  alignItems: 'center',
})
SearchFilterBar.theme = ({ theme }) => ({
  borderTop: [1, theme.base.borderColor.alpha(0.3)],
})

const ExtraFilters = view(UI.View, {
  width: '100%',
  padding: [20, 0],
  opacity: 0,
  transition: 'all ease 50ms',
  visible: {
    opacity: 1,
    transition: 'all ease 100ms 50ms',
  },
})

const simplerDateWords = str =>
  str.replace('about ', '').replace('less than a minute', 'now')

const getDate = ({ startDate, endDate }) => {
  if (!startDate) {
    return null
  }
  const startInWords = simplerDateWords(formatDistance(Date.now(), startDate))
  if (!endDate) {
    return `${startInWords}`
  }
  if (startDate - endDate <= 1000 * 60 * 24) {
    return startInWords
  }
  const endInWords = simplerDateWords(formatDistance(Date.now(), endDate))
  return `${startInWords} - ${endInWords}`
}

type Props = {
  searchStore?: SearchStore
  integrationSettingsStore?: IntegrationSettingsStore
}

const FilterButton = props => (
  <UI.Button
    chromeless
    glint={false}
    size={0.95}
    sizeRadius={3}
    alpha={0.8}
    fontWeight={500}
    {...props}
  />
)

const IntegrationFiltersRow = view({
  flexFlow: 'row',
  alignItems: 'center',
  background: [0, 0, 0, 0.1],
  borderRadius: 100,
})

const decorate = compose(
  view.attach('integrationSettingsStore', 'searchStore'),
  view,
)
export const OrbitSearchFilters = decorate(({ searchStore }: Props) => {
  const { searchFilterStore } = searchStore
  return (
    <>
      <SearchFilterBar>
        <FilterButton
          {...searchFilterStore.dateHover.props}
          active={searchFilterStore.dateHover.isStuck()}
        >
          {getDate(searchFilterStore.dateState) || 'Any time'}
        </FilterButton>
        <div style={{ width: 2 }} />
        <FilterButton onClick={searchFilterStore.toggleSortBy}>
          {searchFilterStore.sortBy}
        </FilterButton>
        <UI.Col flex={1} />
        <IntegrationFiltersRow>
          {searchFilterStore.integrationFilters.map((filter, i) => {
            return (
              <RoundButton
                key={`${filter.icon}${i}`}
                circular
                glint={false}
                size={1.1}
                marginLeft={1}
                icon={<OrbitIcon size={16} icon={filter.icon} />}
                tooltip={filter.name}
                onClick={searchFilterStore.integrationFilterToggler(filter)}
                filter={filter.active ? null : 'grayscale(100%)'}
                opacity={filter.active ? 1 : 0.3}
                background="transparent"
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
