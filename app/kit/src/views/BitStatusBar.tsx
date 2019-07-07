import { DateFormat, normalizeItem, StatusBar, StatusBarButton, StatusBarSection, StatusBarSpace, StatusBarText, View } from '@o/ui'
import { Box, gloss } from 'gloss'
import * as React from 'react'

import { AppBitMainProps } from '../types/AppTypes'

const Cmd = gloss(Box, {
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
