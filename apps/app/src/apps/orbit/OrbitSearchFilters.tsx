import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { RoundButton } from '../../views'

export const OrbitSearchFilters = view(({ appStore, searchStore }) => {
  appStore
  searchStore
  return (
    <div>
      <UI.Row>
        <RoundButton icon="circle">All</RoundButton>
        <UI.Col flex={1} />
      </UI.Row>
    </div>
  )
})
