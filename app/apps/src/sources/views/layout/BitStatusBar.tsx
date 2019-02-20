import { gloss } from '@mcro/gloss'
import { OrbitSourceMainProps } from '@mcro/kit'
import {
  DateFormat,
  StatusBar,
  StatusBarButton,
  StatusBarSection,
  StatusBarSpace,
  StatusBarText,
  View,
} from '@mcro/ui'
import * as React from 'react'

const Cmd = gloss({
  opacity: 0.6,
  marginLeft: 4,
})

export const BitStatusBar = ({ normalizedItem /* , item */ }: OrbitSourceMainProps<any>) => {
  const { location /* , locationLink */, updatedAt } = normalizedItem
  return (
    <StatusBar>
      <StatusBarButton
        onClick={e => {
          e.stopPropagation()
          // !TODO
          // AppActions.open(locationLink)
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
        <StatusBarButton
          onClick={() => {
            // !TODO
            // AppActions.copy(item)
          }}
        >
          Copy Link <Cmd>⌘+C</Cmd>
        </StatusBarButton>
        <View width={5} />
        <StatusBarButton
          onClick={() => {
            // !TODO
            // AppActions.open(item)
          }}
        >
          Open <Cmd>Enter</Cmd>
        </StatusBarButton>
      </StatusBarSection>
    </StatusBar>
  )
}
