import 'react-date-range/dist/styles.css' // main style file
import '../../../public/styles/calendar.css' // theme css file
import * as React from 'react'
import { view, compose } from '@mcro/black'
import * as UI from '@mcro/ui'
import { RoundButton } from '../../views'
import { OrbitIcon } from './OrbitIcon'
import { DateRangePicker } from 'react-date-range'

const SearchFilters = view(UI.Col, {
  padding: [7, 12],
})
SearchFilters.theme = ({ theme }) => ({
  background: theme.base.background,
})

const ExtraFilters = view(UI.View, {
  opacity: 1,
})

const decorate = compose(
  view.attach('integrationSettingsStore', 'searchStore'),
  view,
)
export const OrbitSearchFilters = decorate(({ searchStore }) => {
  return (
    <SearchFilters width="100%" alignItems="center">
      <UI.Row width="100%">
        <UI.Button
          onMouseEnter={searchStore.dateHoverProps.onMouseEnter}
          onMouseLeave={searchStore.dateHoverProps.onMouseLeave}
          onMouseMove={searchStore.dateHoverProps.onMouseMove}
        >
          Today
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
