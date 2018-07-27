import * as React from 'react'
import { HighlightedTextArea } from '../../../views/HighlightedTextArea'
import { view } from '@mcro/black'
import { View } from '@mcro/ui'

const handleKeyDown = e => {
  // up/down/enter
  const { keyCode } = e
  if (keyCode === 38 || keyCode === 40 || keyCode === 13) {
    e.preventDefault()
  }
}

export const OrbitHeaderInput = view(({ searchStore, theme, headerStore }) => {
  return (
    <View height={48} margin={['auto', 0]} padding={[0, 8]} width="100%">
      <HighlightedTextArea
        width="100%"
        fontWeight={300}
        fontSize={20}
        lineHeight="22px"
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
    </View>
  )
})
