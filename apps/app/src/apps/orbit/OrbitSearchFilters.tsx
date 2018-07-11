import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { RoundButton } from '../../views'
import { OrbitIcon } from './OrbitIcon'

export const OrbitSearchFilters = view(({ appStore, searchStore }) => {
  appStore
  searchStore
  return (
    <UI.Row padding={[0, 0, 10]}>
      <UI.Row>
        <RoundButton icon={<OrbitIcon size={14} icon="slack" />}>
          All
        </RoundButton>
        <UI.Col flex={1} />
      </UI.Row>
    </UI.Row>
  )
})
