import { gloss } from '@mcro/gloss'
import { View } from '@mcro/ui'
import * as React from 'react'
import { AppActions } from '../../../actions/AppActions'
import { DateFormat } from '../../../views/DateFormat'
import {
  StatusBar,
  StatusBarButton,
  StatusBarSection,
  StatusBarSpace,
  StatusBarText,
} from '../../../views/StatusBar'
import { OrbitSourceMainProps } from '../../types'

const Cmd = gloss({
  opacity: 0.6,
  marginLeft: 4,
})

export const BitStatusBar = ({ normalizedItem, item }: OrbitSourceMainProps<any>) => {
  const { location, locationLink, updatedAt } = normalizedItem
  return (
    <StatusBar>
      <StatusBarButton
        onClick={e => {
          e.stopPropagation()
          AppActions.open(locationLink)
        }}
      >
        {location}
      </StatusBarButton>
      <StatusBarSpace />
      {!!updatedAt && (
        <StatusBarText>
          <DateFormat date={updatedAt} />
        </StatusBarText>
      )}
      <View flex={1} />
      <StatusBarSection>
        <StatusBarButton onClick={() => AppActions.copyItem(item)}>
          Copy Link <Cmd>⌘+C</Cmd>
        </StatusBarButton>
        <View width={5} />
        <StatusBarButton onClick={() => AppActions.openItem(item)}>
          Open <Cmd>Enter</Cmd>
        </StatusBarButton>
      </StatusBarSection>
    </StatusBar>
  )
}
