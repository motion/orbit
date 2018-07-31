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
    <View height="100%" flex={1} position="relative">
      <HighlightedTextArea
        width="100%"
        fontWeight={400}
        fontSize={16}
        lineHeight={21}
        border="none"
        display="block"
        background="transparent"
        value={searchStore.query}
        highlight={headerStore.highlightWords}
        color={theme.base.color.alpha(0.8)}
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
        position="absolute"
        top="50%"
        right={0}
        marginTop={-8}
        transform={{
          y: -0.5,
        }}
      />
    </View>
  )
})
