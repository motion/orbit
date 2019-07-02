import { useActiveSpace, useReaction } from '@o/kit'
import { ClearButton, sleep, ThemeContext, useSearch, View } from '@o/ui'
import { Box, gloss } from 'gloss'
import React, { memo, useCallback, useState } from 'react'

import { queryStore, useOrbitWindowStore, usePaneManagerStore, useQueryStore } from '../../om/stores'
import { HighlightedTextArea } from '../../views/HighlightedTextArea'
import { appsCarousel } from './OrbitAppsCarousel'
import { useHeaderStore } from './OrbitHeader'

const Keys = {
  up: 38,
  down: 40,
  enter: 13,
}

const handleKeyDown = async e => {
  // up/down/enter
  const { keyCode } = e
  if (keyCode === Keys.up || keyCode === Keys.down || keyCode === Keys.enter) {
    e.preventDefault()
  }

  if (keyCode === Keys.enter) {
    if (appsCarousel.state.zoomedOut) {
      e.stopPropagation()
      appsCarousel.zoomIntoApp()
      await sleep(16)
      queryStore.clearPrefix()
      return
    }
  }
}

function useActivePane() {
  const paneManagerStore = usePaneManagerStore()
  return paneManagerStore.activePane
}

export const OrbitHeaderInput = memo(function OrbitHeaderInput({ fontSize }: { fontSize: number }) {
  // separate value here, lets us interface with queryStore/search, + will be useful for concurrent
  const [inputVal, setInputVal] = useState('')
  const search = useSearch()
  const qs = useQueryStore()
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
    setInputVal(e.target.value)
    qs.setQuery(e.target.value)
  }, [])

  // if we clear the queryStore, clear the input
  useReaction(
    () => queryStore.prefixFirstWord,
    prefixFirstWord => {
      if (!prefixFirstWord) {
        setInputVal(queryStore.queryInstant)
      }
    },
  )

  // we only send the query without prefix to be used in lists, etc
  useReaction(
    () => queryStore.queryWithoutPrefix,
    val => {
      if (val !== search.query) {
        search.setQuery(val)
      }
    },
  )

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
          value={inputVal}
          highlight={headerStore.highlightWords}
          color={activeTheme.color}
          onChange={onChangeQuery}
          onFocus={orbitWindowStore.onFocus}
          onBlur={orbitWindowStore.onBlur}
          onKeyDown={handleKeyDown}
        />
      </View>
      <After>
        <ClearButton margin={['auto', 5]} visible={qs.hasQuery} onClick={qs.clearQuery} />
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
