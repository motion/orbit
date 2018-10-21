import * as React from 'react'
import { view, compose } from '@mcro/black'
import { SearchStore } from '../SearchStore'
import { Row, Button, Popover, View } from '@mcro/ui'
import { OrbitIcon } from '../../../../views/OrbitIcon'
import { NavButton } from '../../../../views/NavButton'
import { DateRangePicker } from 'react-date-range'

type Props = {
  searchStore?: SearchStore
  forwardRef?: any
  width?: number
}

export const FilterButton = props => (
  <Button circular chromeless size={0.9} sizePadding={0.8} {...props} />
)

const decorate = compose(
  view.attach('searchStore'),
  view,
)
export const OrbitFilters = decorate(({ searchStore, ...props }: Props) => {
  const { searchFilterStore } = searchStore
  if (!searchFilterStore.integrationFilters.length) {
    return null
  }
  return (
    <Row {...props}>
      <NavButton
        onClick={searchFilterStore.toggleSortBy}
        icon={searchFilterStore.sortBy === 'Recent' ? 'sort' : 'trend'}
        tooltip={searchFilterStore.sortBy}
        opacity={0.5}
      />
      <Popover
        delay={100}
        openOnClick
        openOnHover
        closeOnClickAway
        group="filters"
        target={
          <NavButton
            icon="calendar"
            opacity={searchStore.searchFilterStore.hasDateFilter ? 1 : 0.5}
          />
        }
        alignPopover="left"
        adjust={[220, 0]}
        background
        borderRadius={6}
        elevation={4}
        theme="light"
      >
        <View width={440} height={300} className="calendar-dom theme-light" padding={10}>
          <DateRangePicker
            onChange={searchStore.searchFilterStore.onChangeDate}
            ranges={[searchStore.searchFilterStore.dateState]}
          />
        </View>
      </Popover>
      {searchFilterStore.integrationFilters.map((filter, i) => {
        return (
          <FilterButton
            key={`${filter.integration}${i}`}
            active={filter.active}
            onClick={searchFilterStore.integrationFilterToggler(filter)}
            tooltip={filter.name}
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
            <OrbitIcon name={filter.integration} size={16} />
          </FilterButton>
        )
      })}
    </Row>
  )
})
