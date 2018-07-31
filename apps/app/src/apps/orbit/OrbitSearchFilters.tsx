import 'react-date-range/dist/styles.css' // main style file
import '../../../public/styles/calendar.css' // theme css file
import * as React from 'react'
import { view, compose } from '@mcro/black'
import * as UI from '@mcro/ui'
import { RoundButton } from '../../views'
import { OrbitIcon } from './OrbitIcon'
import { DateRangePicker } from 'react-date-range'
import { formatDistance } from 'date-fns'
import { SearchStore } from '../../stores/SearchStore'
import { IntegrationSettingsStore } from '../../stores/IntegrationSettingsStore'

const SearchFilters = view(UI.Col, {
  padding: [7, 12],
})

SearchFilters.theme = ({ theme }) => ({
  borderTop: [1, theme.base.background.darken(0.1)],
  background: `linear-gradient(${theme.base.background.darken(
    0.07,
  )}, ${theme.base.background.darken(0.05)} 40px)`,
})

const ExtraFilters = view(UI.View, {
  width: '100%',
  opacity: 1,
  padding: [20, 0],
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
    return `last ${startInWords}`
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
  const { searchFilterStore, nlpStore } = searchStore
  if (!nlpStore.nlp.date) {
    return null
  }
  return (
    <SearchFilters width="100%" alignItems="center">
      <UI.Row width="100%">
        <FilterButton {...searchStore.dateHover.props}>
          {getDate(nlpStore.nlp.date) || 'Any time'}
        </FilterButton>
        <div style={{ width: 4 }} />
        <FilterButton>Relevant</FilterButton>
        <UI.Col flex={1} />
        {searchFilterStore.filters.map((filter, i) => {
          return (
            <RoundButton
              key={`${filter.icon}${i}`}
              circular
              size={1.2}
              marginLeft={8}
              icon={<OrbitIcon size={20} icon={filter.icon} />}
              tooltip={filter.name}
              onClick={searchFilterStore.filterToggler(filter)}
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
        onMouseEnter={searchStore.dateHover.props.onMouseEnter}
        onMouseLeave={searchStore.dateHover.props.onMouseLeave}
        onMouseMove={searchStore.dateHover.props.onMouseMove}
        className="calendar-dom"
        height={searchStore.extraFiltersHeight}
      >
        <DateRangePicker
          onChange={searchStore.onChangeDate}
          {...searchStore.dateState}
        />
      </ExtraFilters>
    </SearchFilters>
  )
})
