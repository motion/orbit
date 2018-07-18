import 'react-date-range/dist/styles.css' // main style file
import '../../../public/styles/calendar.css' // theme css file
import * as React from 'react'
import { view, compose } from '@mcro/black'
import * as UI from '@mcro/ui'
import { RoundButton } from '../../views'
import { OrbitIcon } from './OrbitIcon'
import { DateRangePicker } from 'react-date-range'
import { formatDistance } from 'date-fns'

const SearchFilters = view(UI.Col, {
  padding: [7, 12],
})
SearchFilters.theme = ({ theme }) => ({
  background: theme.base.background,
})

const ExtraFilters = view(UI.View, {
  opacity: 1,
  padding: [20, 0],
})

const getDate = ({ startDate, endDate }) => {
  if (!startDate) {
    return null
  }
  const startInWords = formatDistance(Date.now(), startDate)
  if (!endDate) {
    return startInWords
  }
  const endInWords = formatDistance(Date.now(), endDate)
  return `${startInWords} - ${endInWords}`
}

const decorate = compose(
  view.attach('integrationSettingsStore', 'searchStore', 'appStore'),
  view,
)
export const OrbitSearchFilters = decorate(({ searchStore, appStore }) => {
  return (
    <SearchFilters width="100%" alignItems="center">
      <UI.Row width="100%">
        <UI.Button
          alpha={0.8}
          onMouseEnter={searchStore.dateHoverProps.onMouseEnter}
          onMouseLeave={searchStore.dateHoverProps.onMouseLeave}
          onMouseMove={searchStore.dateHoverProps.onMouseMove}
        >
          {getDate(appStore.nlpStore.nlp.date) || 'Any time'}
        </UI.Button>
        <UI.Col flex={1} />
        {searchStore.filters.map((filter, i) => {
          return (
            <RoundButton
              key={`${filter.icon}${i}`}
              circular
              size={1.2}
              marginRight={5}
              icon={<OrbitIcon size={22} icon={filter.icon} />}
            />
          )
        })}
      </UI.Row>
      <ExtraFilters
        onMouseEnter={searchStore.dateHoverProps.onMouseEnter}
        onMouseLeave={searchStore.dateHoverProps.onMouseLeave}
        onMouseMove={searchStore.dateHoverProps.onMouseMove}
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
