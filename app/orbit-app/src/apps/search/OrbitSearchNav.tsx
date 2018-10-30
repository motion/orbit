import './calendar.css' // theme css file
import * as React from 'react'
import { Row, View, Popover } from '@mcro/ui'
import { NavButton } from '../../views/NavButton'
import { view, react, ensure, attach } from '@mcro/black'
import { OrbitSuggestionBar } from './OrbitSuggestionBar'
import { ORBIT_WIDTH } from '@mcro/constants'
import { DateRangePicker } from 'react-date-range'
import { QueryStore } from '../../stores/QueryStore/QueryStore'
import { hoverSettler } from '../../helpers'
import { OrbitFilters } from './OrbitFilters'

type Props = {
  queryStore?: QueryStore
  store?: OrbitNavStore
}

class OrbitNavStore {
  props: Props

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

@attach('searchStore', 'queryStore')
@attach({
  store: OrbitNavStore,
})
@view
export class OrbitSearchNav extends React.Component<Props> {
  navButtonBg = theme => (this.props.store.hoverSettle.isStuck() ? theme.background : 'transparent')
  setStuck = () => this.props.store.hoverSettle.setStuck(true)

  render() {
    const { queryStore, store } = this.props
    const { onClick, ...hoverProps } = store.hoverSettle.props
    const { queryFilters } = queryStore
    const stickFilters = store.hoverSettle.isStuck()
    return (
      <Row position="relative" alignItems="center" padding={[0, 6, 12]}>
        <Row position="relative" zIndex={1}>
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
          />
          <NavButton
            icon="funnel41"
            // otherwise it wasnt picking up styles...
            key={`${stickFilters}`}
            background={this.navButtonBg}
            opacity={stickFilters || !!queryFilters.hasIntegrationFilters ? 1 : 0.5}
            onClick={store.handleToggleFilters}
            {...hoverProps}
          />
        </Row>

        {/* overflow contain row */}
        <Row position="absolute" left={110} right={0} overflow="hidden">
          <Row
            width={`calc(100% + ${store.filtersWidth}px)`}
            marginRight={-store.filtersWidth}
            transition="transform ease 120ms, opacity ease 180ms 180ms"
            transform={{
              x: store.showFilters ? 0 : -store.filtersWidth,
            }}
          >
            <View width={store.filtersWidth} />
            <OrbitFilters
              opacity={store.showFilters ? 1 : 0}
              forwardRef={store.setFilterRef}
              onClick={this.setStuck}
              position="absolute"
              top={0}
              left={0}
              {...hoverProps}
            />
            <OrbitSuggestionBar />
          </Row>
        </Row>

        <View flex={1} />

        {/* <NavButton
            onClick={queryFilters.toggleSortBy}
            icon={queryFilters.sortBy === 'Recent' ? 'list' : 'grid'}
            tooltip={queryFilters.sortBy}
            opacity={0.5}
          /> */}
      </Row>
    )
  }
}
