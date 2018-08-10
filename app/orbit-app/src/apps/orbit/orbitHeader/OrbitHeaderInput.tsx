import * as React from 'react'
import { HighlightedTextArea } from '../../../views/HighlightedTextArea'
import { view } from '@mcro/black'
import { View } from '@mcro/ui'
import * as UI from '@mcro/ui'
import { App } from '@mcro/stores'

const handleKeyDown = e => {
  // up/down/enter
  const { keyCode } = e
  if (keyCode === 38 || keyCode === 40 || keyCode === 13) {
    e.preventDefault()
  }
}

export const OrbitHeaderInput = view(({ searchStore, theme, headerStore }) => {
  return (
    <View
      height="100%"
      flex={1}
      position="relative"
      flexFlow="row"
      alignItems="center"
    >
      <HighlightedTextArea
        width="100%"
        fontWeight={600}
        fontSize={15}
        lineHeight={21.5}
        border="none"
        display="block"
        background="transparent"
        value={searchStore.query}
        highlight={headerStore.highlightWords}
        color={theme.base.color}
        onChange={searchStore.onChangeQuery}
        onFocus={searchStore.onFocus}
        onBlur={searchStore.onBlur}
        onKeyDown={handleKeyDown}
        forwardRef={headerStore.inputRef}
        onClick={headerStore.onClickInput}
      />
      <UI.ClearButton
        onClick={searchStore.clearQuery}
        opacity={App.state.query ? 1 : 0}
      />
    </View>
  )
})
