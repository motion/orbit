import * as React from 'react'
import { view, compose } from '@mcro/black'
import * as UI from '@mcro/ui'
import { RoundButton } from '../../views'
import { OrbitIcon } from './OrbitIcon'

class SearchFilterStore {
  filters = []
}

const decorate = compose(
  view.provide('integrationSettingsStore'),
  view.attach({ store2: SearchFilterStore }),
  view,
)

export const OrbitSearchFilters = decorate(props => {
  console.log('props', props)
  return (
    <UI.Row width="100%" padding={[0, 0, 10]} alignItems="center">
      {/* <UI.Icon name="ui-2_filter" size={12} opacity={0.6} marginRight={12} /> */}
      <select>
        <option>Last month</option>
      </select>
      <select>
        <option>Everyone</option>
      </select>
      <UI.Col flex={1} />
      {(store.filters || []).map((filter, i) => {
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
})
