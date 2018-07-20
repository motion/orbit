import * as React from 'react'
import { HighlightedTextArea } from '../../../views/HighlightedTextArea'
import { view } from '@mcro/black'
import { View } from '@mcro/ui'

const handleKeyDown = e => {
  // up/down
  const { keyCode } = e
  if (keyCode === 38 || keyCode === 40) {
    e.preventDefault()
  }
}

export const OrbitHeaderInput = view(({ orbitStore, theme, headerStore }) => {
  return (
    <View height={30} margin={['auto', 0]} padding={[0, 10]} width="100%">
      <HighlightedTextArea
        width="100%"
        fontWeight={300}
        fontSize={22}
        lineHeight="22px"
        border="none"
        display="block"
        background="transparent"
        value={orbitStore.query}
        highlight={headerStore.highlightWords}
        color={theme.base.color.alpha(0.8)}
        onChange={orbitStore.onChangeQuery}
        onFocus={orbitStore.onFocus}
        onBlur={orbitStore.onBlur}
        onKeyDown={handleKeyDown}
        forwardRef={headerStore.inputRef}
        onClick={headerStore.onClickInput}
      />
    </View>
  )
})
