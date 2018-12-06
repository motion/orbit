import './calendar.css' // theme css file
import * as React from 'react'
import { Row, View, Popover } from '@mcro/ui'
import { NavButton } from '../../../views/NavButton'
import { react, ensure, StoreContext, view } from '@mcro/black'
import { OrbitSuggestionBar } from './OrbitSuggestionBar'
import { ORBIT_WIDTH } from '@mcro/constants'
import { DateRangePicker } from 'react-date-range'
import { QueryStore } from '../../../stores/QueryStore/QueryStore'
import { hoverSettler } from '../../../helpers'
import { OrbitFilters } from './OrbitFilters'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'

class OrbitNavStore {
  props: { queryStore: QueryStore }

  filtersWidth = 0
  hoveredFilters = false
  filtersRef = null as HTMLDivElement
  hoverSettle = hoverSettler({
    enterDelay: 40,
    betweenDelay: 40,
    onHovered: res => {
      this.hoveredFilters = !!res
    },
  })()

  setFilterRef = ref => {
    this.filtersRef = ref
  }

  get showFilters() {
    return this.hoveredFilters || this.hoverSettle.isStuck()
  }

  measureFilters = react(
    () => [this.props.queryStore.queryFilters.integrationFilters.length, this.showFilters],
    () => {
      ensure('this.filtersRef', !!this.filtersRef)
      this.filtersWidth = Math.min(ORBIT_WIDTH, this.filtersRef.clientWidth)
    },
  )

  handleToggleFilters = e => {
    e.preventDefault()
    e.stopPropagation()
    console.log('click...')
    this.hoverSettle.toggleStuck()
    if (!this.hoverSettle.isStuck()) {
      this.hoveredFilters = false
    }
  }
}

export const OrbitSearchNav = observer(() => {
  const { queryStore } = React.useContext(StoreContext)
  const store = useStore(OrbitNavStore, { queryStore })
  const { queryFilters } = queryStore

  return (
    <Row alignItems="center" flex={1}>
      <Row position="relative" zIndex={1} padding={[0, 100, 0, 0]}>
        <Popover
          delay={100}
          openOnClick
          openOnHover
          closeOnClickAway
          group="filters"
          target={<NavButton icon="calendar" opacity={queryFilters.hasDateFilter ? 1 : 0.5} />}
          alignPopover="left"
          adjust={[220, 0]}
          background
          borderRadius={6}
          elevation={4}
          theme="light"
        >
          <View width={440} height={300} className="calendar-dom theme-light" padding={10}>
            <DateRangePicker
              onChange={queryFilters.onChangeDate}
              ranges={[queryFilters.dateState]}
            />
          </View>
        </Popover>
        <NavButton
          onClick={queryFilters.toggleSortBy}
          icon={queryFilters.sortBy === 'Recent' ? 'sort' : 'trend'}
          tooltip={queryFilters.sortBy}
          opacity={0.5}
        >
          {queryFilters.sortBy}
        </NavButton>
      </Row>

      <ScrollableRow flex={10}>
        <OrbitSuggestionBar />
      </ScrollableRow>

      <ScrollableRow maxWidth="33%">
        <OrbitFilters forwardRef={store.setFilterRef} />
      </ScrollableRow>
    </Row>
  )
})

const ScrollableRow = view(View, {
  flexFlow: 'row',
  overflowX: 'auto',
  alignItems: 'center',
  padding: [0, 20],
})
