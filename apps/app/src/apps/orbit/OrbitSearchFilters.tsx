import 'react-date-range/dist/styles.css' // main style file
import '../../../public/styles/calendar.css' // theme css file
import * as React from 'react'
import { view, compose } from '@mcro/black'
import * as UI from '@mcro/ui'
import { RoundButton } from '../../views'
import { OrbitIcon } from './OrbitIcon'
import { DateRangePicker } from 'react-date-range'

const Select = view('select', {})

class SearchFilterStore {
  dateState = {
    ranges: [
      {
        startDate: Date.now(),
        endDate: Date.now(),
        key: 'selection',
      },
    ],
  }

  get filters() {
    const { settingsList } = this.props.integrationSettingsStore
    if (!settingsList) {
      return []
    }
    return settingsList
      .filter(x => x.type !== 'setting')
      .map(setting => ({ icon: setting.type }))
  }

  onChangeDate = ranges => {
    this.dateState = {
      ranges: [ranges.selection],
    }
    // this.dateState = ranges
  }
}

const decorate = compose(
  view.attach('integrationSettingsStore'),
  view.attach({ store: SearchFilterStore }),
  view,
)

const SearchFilters = view(UI.Row, {
  padding: [7, 12],
})

SearchFilters.theme = ({ theme }) => ({
  background: theme.base.background,
})

const x = ({ store, ...props }) => {
  return (
    <SearchFilters width="100%" alignItems="center">
      {/* <UI.Icon name="ui-2_filter" size={12} opacity={0.6} marginRight={12} /> */}
      <div className="calendar-dom">
        <DateRangePicker onChange={store.onChangeDate} {...store.dateState} />
      </div>
      <UI.Col flex={1} />
      {store.filters.map((filter, i) => {
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
    </SearchFilters>
  )
}

export const OrbitSearchFilters = decorate(x)
