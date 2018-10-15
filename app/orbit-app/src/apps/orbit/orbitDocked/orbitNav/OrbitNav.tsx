import './calendar.css' // theme css file
import * as React from 'react'
import { SearchStore } from '../SearchStore'
import { Row, Popover, View } from '@mcro/ui'
import { NavButton } from '../../../../views/NavButton'
import { DateRangePicker } from 'react-date-range'
import { OrbitFilters, FilterButton } from '../orbitHome/OrbitFilters'
import { view, react } from '@mcro/black'
import { OrbitSuggestionBar } from '../../orbitHeader/OrbitSuggestionBar'
import { QueryStore } from '../QueryStore'
import { hoverSettler } from '../../../../helpers'
import { ORBIT_WIDTH } from '@mcro/constants'

type Props = {
  searchStore?: SearchStore
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
    () => [this.props.searchStore.searchFilterStore.integrationFilters.length, this.showFilters],
    () => {
      console.log('measure...', this.filtersRef.clientWidth)
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

@view.attach('searchStore', 'queryStore')
@view.attach({
  store: OrbitNavStore,
})
@view
export class OrbitNav extends React.Component<Props> {
  navButtonBg = theme => (this.props.store.hoverSettle.isStuck() ? theme.background : 'transparent')
  setStuck = () => this.props.store.hoverSettle.setStuck(true)

  render() {
    const { searchStore, store } = this.props
    const { onClick, ...hoverProps } = store.hoverSettle.props
    const { searchFilterStore } = searchStore
    return (
      <View position="relative" zIndex={100} overflow="hidden">
        <Row position="relative" alignItems="center" padding={[0, 10]}>
          <Row position="relative" zIndex={1}>
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
            <NavButton
              icon="funnel40"
              key={store.hoverSettle.isStuck()}
              background={this.navButtonBg}
              opacity={
                store.showFilters || !!searchStore.searchFilterStore.hasIntegrationFilters ? 1 : 0.5
              }
              onClick={store.handleToggleFilters}
              {...hoverProps}
            />
          </Row>

          {/* overflow contain row */}
          <Row position="absolute" left={70} right={45} overflow="hidden">
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

          <NavButton
            onClick={searchFilterStore.toggleSortBy}
            icon={searchFilterStore.sortBy === 'Recent' ? 'arrow-min-down' : 'chart'}
            tooltip={searchFilterStore.sortBy}
            opacity={0.5}
          />
        </Row>
      </View>
    )
  }
}
