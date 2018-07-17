import * as React from 'react'
import { view, compose } from '@mcro/black'
import * as UI from '@mcro/ui'
import { RoundButton } from '../../views'
import { OrbitIcon } from './OrbitIcon'

const Select = view('select', {})

class SearchFilterStore {
  filters = []
}

const decorate = compose(
  view.attach('integrationSettingsStore'),
  view.attach({ store: SearchFilterStore }),
  view,
)

const x = ({ store, ...props }) => {
  return (
    <UI.Row width="100%" padding={[0, 15, 10]} alignItems="center">
      {/* <UI.Icon name="ui-2_filter" size={12} opacity={0.6} marginRight={12} /> */}
      <Select>
        <option>Last month</option>
      </Select>
      <Select>
        <option>Everyone</option>
      </Select>
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
    </UI.Row>
  )
}

export const OrbitSearchFilters = decorate(x)
