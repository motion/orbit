import { gloss } from '@o/gloss'
import { DateFormat, StatusBar, StatusBarButton, StatusBarSection, StatusBarSpace, StatusBarText, View } from '@o/ui'
import * as React from 'react'
import { normalizeItem } from '../helpers/normalizeItem'
import { AppBitMainProps } from '../types/AppDefinition'

const Cmd = gloss({
  opacity: 0.6,
  marginLeft: 4,
})

export const BitStatusBar = ({ item }: AppBitMainProps) => {
  const normalizedItem = normalizeItem(item)
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
