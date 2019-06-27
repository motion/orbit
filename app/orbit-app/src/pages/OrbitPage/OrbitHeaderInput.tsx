import { useActiveSpace } from '@o/kit'
import { ClearButton, ThemeContext, useSearch, View } from '@o/ui'
import { Box, gloss } from 'gloss'
import React, { memo, useCallback } from 'react'

import { useOrbitWindowStore, usePaneManagerStore, useQueryStore } from '../../om/stores'
import { HighlightedTextArea } from '../../views/HighlightedTextArea'
import { useHeaderStore } from './OrbitHeader'

const handleKeyDown = e => {
  // up/down/enter
  const { keyCode } = e
  if (keyCode === 38 || keyCode === 40 || keyCode === 13) {
    e.preventDefault()
  }
}

function useActivePane() {
  const paneManagerStore = usePaneManagerStore()
  return paneManagerStore.activePane
}

export const OrbitHeaderInput = memo(function OrbitHeaderInput({ fontSize }: { fontSize: number }) {
  const search = useSearch()
  const queryStore = useQueryStore()
  const orbitWindowStore = useOrbitWindowStore()
  const headerStore = useHeaderStore()
  const { activeTheme } = React.useContext(ThemeContext)
  const [activeSpace] = useActiveSpace()
  const activePane = useActivePane()
  const placeholder =
    (activePane &&
      activeSpace &&
      (activePane.type === 'sources' ? `Manage ${activeSpace.name}` : activePane.name)) ||
    ''

  const onChangeQuery = useCallback(e => {
    search.setQuery(e.target.value)
    queryStore.onChangeQuery(e.target.value)
  }, [])

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
          value={search.query}
          highlight={headerStore.highlightWords}
          color={activeTheme.color}
          onChange={onChangeQuery}
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
