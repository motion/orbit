import './calendar.css' // theme css file
import * as React from 'react'
import { view, compose } from '@mcro/black'
import * as UI from '@mcro/ui'
import { RoundButton } from '../../../../views'
import { OrbitIcon } from '../../../../views/OrbitIcon'
import { DateRangePicker } from 'react-date-range'
import { formatDistance, differenceInCalendarDays } from 'date-fns'
import { SearchStore } from '../SearchStore'

const SearchFilters = view(UI.Col, {
  padding: [0, 12],
})

const SearchFilterBar = view({
  flexFlow: 'row',
  padding: [6, 12],
  width: '100%',
  alignItems: 'center',
})
SearchFilterBar.theme = ({ theme }) => ({
  borderTop: [1, theme.borderColor.alpha(0.3)],
})

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

const simplerDateWords = str => str.replace('about ', '').replace('less than a minute', 'now')
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const getSuffix = str => {
  const m = str.match(/(months|days|weeks)/)
  return m ? m[0] : null
}

const getDate = ({ startDate, endDate }: { startDate?: Date; endDate?: Date }) => {
  if (!startDate) {
    return null
  }
  let startInWords = simplerDateWords(formatDistance(Date.now(), startDate))
  if (!endDate) {
    return `${startInWords}`
  }
  const oneDayInMinutes = 60 * 24 * 1000
  console.log('difference is', endDate.getTime() - startDate.getTime())
  if (endDate.getTime() - startDate.getTime() <= oneDayInMinutes) {
    return startInWords
  }
  // if pretty recent we can show week/day level word diff
  const dayDiff = differenceInCalendarDays(new Date(), endDate)
  if (dayDiff < 30) {
    const endInWords = simplerDateWords(formatDistance(Date.now(), endDate))
    // we can remove the first suffix for brevity
    if (getSuffix(endInWords) === getSuffix(startInWords)) {
      startInWords = startInWords.replace(` ${getSuffix(startInWords)}`, '')
    }
    return `${startInWords} - ${endInWords}`
  }
  // if older we should just show month level words
  const startMonth = monthNames[startDate.getMonth()]
  const endMonth = monthNames[endDate.getMonth()]
  if (startMonth === endMonth) {
    return startMonth
  }
  return `${startMonth.slice(0, 3)} - ${endMonth.slice(0, 3)}}`
}

type Props = {
  searchStore?: SearchStore
}

const FilterButton = props => (
  <UI.Button
    chromeless
    glint={false}
    size={1}
    sizePadding={0.9}
    sizeRadius={3}
    alpha={0.8}
    fontWeight={600}
    {...props}
  />
)

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
