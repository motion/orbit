import { useActiveSpace } from '@o/kit'
import { ClearButton, ThemeContext, useSearch, View } from '@o/ui'
import { Box, gloss } from 'gloss'
import React, { memo, useCallback } from 'react'

import { queryStore, useOrbitWindowStore, usePaneManagerStore, useQueryStore } from '../../om/stores'
import { HighlightedTextArea } from '../../views/HighlightedTextArea'
import { appsCarousel } from './OrbitAppsCarousel'
import { useHeaderStore } from './OrbitHeader'

const Keys = {
  up: 38,
  down: 40,
  enter: 13,
}

const handleKeyDown = e => {
  // up/down/enter
  const { keyCode } = e
  if (keyCode === Keys.up || keyCode === Keys.down || keyCode === Keys.enter) {
    e.preventDefault()
  }

  if (keyCode === Keys.enter) {
    if (appsCarousel.state.zoomedOut) {
      e.stopPropagation()
      appsCarousel.zoomIntoApp()
      // if we had a query prefix active
      if (queryStore.ignorePrefix) {
        // remove the prefix we were using on enter
        queryStore.setQuery(queryStore.queryParsed)
      } else {
        // otherwise clear the searched app query
        queryStore.clearQuery()
      }
      return
    }
  }
}

function useActivePane() {
  const paneManagerStore = usePaneManagerStore()
  return paneManagerStore.activePane
}

export const OrbitHeaderInput = memo(function OrbitHeaderInput({ fontSize }: { fontSize: number }) {
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
    search.setQuery(e.target.value)
    qs.onChangeQuery(e.target.value)
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
