import 'react-date-range/dist/styles.css' // main style file
import '../../../../public/styles/calendar.css' // theme css file
import * as React from 'react'
import { view, compose } from '@mcro/black'
import * as UI from '@mcro/ui'
import { RoundButton } from '../../../views'
import { OrbitIcon } from '../../../views/OrbitIcon'
import { DateRangePicker } from 'react-date-range'
import { formatDistance } from 'date-fns'
import { SearchStore } from '../../../stores/SearchStore'
import { IntegrationSettingsStore } from '../../../stores/IntegrationSettingsStore'

const SearchFilters = view(UI.Col, {
  padding: [7, 12],
})

SearchFilters.theme = ({ theme }) => ({
  borderTop: [1, theme.base.borderColor],
  background: 'transparent',
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

const getDate = ({ startDate, endDate }) => {
  if (!startDate) {
    return null
  }
  const startInWords = formatDistance(Date.now(), startDate).replace(
    'about ',
    '',
  )
  if (!endDate) {
    return `${startInWords}`
  }
  const endInWords = formatDistance(Date.now(), endDate).replace('about ', '')
  return `${startInWords} - ${endInWords}`
}

type Props = {
  searchStore?: SearchStore
  integrationSettingsStore?: IntegrationSettingsStore
}

const FilterButton = props => (
  <UI.Button background="#fbfbfb" alpha={0.9} {...props} />
)

const decorate = compose(
  view.attach('integrationSettingsStore', 'searchStore'),
  view,
)
export const OrbitSearchFilters = decorate(({ searchStore }: Props) => {
  const { searchFilterStore } = searchStore
  return (
    <SearchFilters width="100%" alignItems="center">
      <UI.Row width="100%">
        <FilterButton
          {...searchFilterStore.dateHover.props}
          active={searchFilterStore.dateHover.isStuck()}
        >
          {getDate(searchFilterStore.dateState) || 'Any time'}
        </FilterButton>
        <div style={{ width: 4 }} />
        <FilterButton onClick={searchFilterStore.toggleSortBy}>
          {searchFilterStore.sortBy}
        </FilterButton>
        <UI.Col flex={1} />
        {searchFilterStore.integrationFilters.map((filter, i) => {
          return (
            <RoundButton
              key={`${filter.icon}${i}`}
              circular
              size={1.2}
              marginLeft={4}
              icon={<OrbitIcon size={20} icon={filter.icon} />}
              tooltip={filter.name}
              onClick={searchFilterStore.integrationFilterToggler(filter)}
              filter={filter.active ? null : 'grayscale(100%)'}
              opacity={filter.active ? 1 : 0.3}
              background="transparent"
              {...{
                '&:hover': {
                  filter: 'none',
                  opacity: filter.active ? 1 : 0.75,
                },
              }}
            />
          )
        })}
      </UI.Row>
      <ExtraFilters
        onMouseEnter={searchFilterStore.dateHover.props.onMouseEnter}
        onMouseLeave={searchFilterStore.dateHover.props.onMouseLeave}
        onMouseMove={searchFilterStore.dateHover.props.onMouseMove}
        className="calendar-dom"
        height={searchStore.extraFiltersHeight}
        visible={searchStore.extraFiltersVisible}
      >
        <DateRangePicker
          onChange={searchFilterStore.onChangeDate}
          ranges={[searchFilterStore.dateState]}
        />
      </ExtraFilters>
    </SearchFilters>
  )
})
