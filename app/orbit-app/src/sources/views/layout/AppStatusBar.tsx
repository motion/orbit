import * as React from 'react'
import { StatusBar } from '../../../views/StatusBar'
import { AppActions } from '../../../actions/AppActions'
import { View } from '@mcro/ui'
import { DateFormat } from '../../../views/DateFormat'
import { view } from '@mcro/black'
import { OrbitSourceMainProps } from '../../types'

const Cmd = view({
  opacity: 0.6,
})

export const AppStatusBar = ({ viewStore, normalizedItem }: OrbitSourceMainProps<any>) => {
  const { location, locationLink, updatedAt } = normalizedItem
  return (
    <StatusBar>
      <StatusBar.Button
        onClick={e => {
          e.stopPropagation()
          AppActions.open(locationLink)
        }}
      >
        {location}
      </StatusBar.Button>
      <StatusBar.Space />
      {!!updatedAt && (
        <StatusBar.Text>
          <DateFormat date={updatedAt} />
        </StatusBar.Text>
      )}
      <View flex={1} />
      <StatusBar.Section>
        <StatusBar.Button onClick={viewStore.copyItem}>
          Copy Link <Cmd>⌘+C</Cmd>
        </StatusBar.Button>
        <View width={5} />
        <StatusBar.Button onClick={viewStore.openItem}>
          Open <Cmd>Enter</Cmd>
        </StatusBar.Button>
      </StatusBar.Section>
    </StatusBar>
  )
}
