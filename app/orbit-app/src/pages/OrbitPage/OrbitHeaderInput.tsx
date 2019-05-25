import { useActiveSpace } from '@o/kit'
import { ClearButton, ThemeContext, View } from '@o/ui'
import { Box, gloss } from 'gloss'
import React, { memo } from 'react'

import { useStores } from '../../hooks/useStores'
import { HighlightedTextArea } from '../../views/HighlightedTextArea'

const handleKeyDown = e => {
  // up/down/enter
  const { keyCode } = e
  if (keyCode === 38 || keyCode === 40 || keyCode === 13) {
    e.preventDefault()
  }
}

function useActivePane() {
  const { paneManagerStore } = useStores()
  return paneManagerStore.activePane
}

export const OrbitHeaderInput = memo(function OrbitHeaderInput() {
  const { orbitStore, orbitWindowStore, queryStore, headerStore } = useStores()
  const { activeTheme } = React.useContext(ThemeContext)
  const [activeSpace] = useActiveSpace()
  const activePane = useActivePane()
  const placeholder =
    (activePane &&
      activeSpace &&
      (activePane.type === 'sources' ? `Manage ${activeSpace.name}` : activePane.name)) ||
    ''
  const fontSize = 18
  return (
    <FakeInput>
      <View height="100%" flex={1} position="relative" flexFlow="row" alignItems="center">
        <HighlightedTextArea
          forwardRef={headerStore.inputRef}
          width="100%"
          fontWeight={400}
          fontSize={fontSize}
          lineHeight={fontSize + 4}
          border="none"
          display="block"
          background="transparent"
          placeholder={placeholder}
          value={queryStore.queryInstant}
          highlight={headerStore.highlightWords}
          color={activeTheme.color}
          onChange={queryStore.onChangeQuery}
          onFocus={orbitWindowStore.onFocus}
          onBlur={orbitWindowStore.onBlur}
          onKeyDown={handleKeyDown}
        />
      </View>
      <After>
        <ClearButton
          margin={['auto', 5]}
          visible={queryStore.hasQuery}
          onClick={queryStore.clearQuery}
        />
      </After>
    </FakeInput>
  )
})

const After = gloss(Box, {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  alignItems: 'center',
  justifyContent: 'center',
  flexFlow: 'row',
})

const FakeInput = gloss(View, {
  position: 'relative',
  height: 34,
  padding: [2, 12],
  alignItems: 'center',
  justifyContent: 'center',
  flexFlow: 'row',
  flex: 1,
  cursor: 'text',
  transition: 'none',
})
