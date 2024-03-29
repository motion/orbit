import { createUsableStore, react, useActiveSpace, useReaction } from '@o/kit'
import { ClearButton, useSearch, View } from '@o/ui'
import { Box, gloss, useTheme } from 'gloss'
import React, { memo, useCallback, useState } from 'react'

import { appsDrawerStore, queryStore, useOrbitWindowStore, useQueryStore } from '../../om/stores'
import { HighlightedTextArea } from '../../views/HighlightedTextArea'
import { appsCarouselStore } from './OrbitAppsCarouselStore'
import { useHeaderStore } from './OrbitHeaderStore'
import { orbitSearchResultsStore } from './OrbitSearchResultsStore'

const Keys = {
  up: 38,
  down: 40,
  enter: 13,
  space: 32,
}

// handle query prefixes
createUsableStore(
  class HeaderInputStore {
    updateQueryPrefix = react(
      () => [appsCarouselStore.state.zoomedOut, queryStore.hasQuery, appsDrawerStore.isOpen],
      ([zoomedOut, hasQuery, drawerOpen]) => {
        if (orbitSearchResultsStore.isSelectingContent) {
          return
        }
        if (drawerOpen) {
          queryStore.setPrefixFirstWord(false)
          return
        }
        if (!zoomedOut && !hasQuery) {
          // if youre zoomed into an app and you clear the query bar,
          // we should stop ignoring the prefix we used previosuly
          queryStore.setPrefixFirstWord(false)
          return
        }
        if (zoomedOut) {
          // ignore until we next clear the querybar
          queryStore.setPrefixFirstWord()
          return
        }
      },
    )
  },
)

const handleKeyDown = async e => {
  // up/down/enter
  const { keyCode } = e
  if (keyCode === Keys.up || keyCode === Keys.down || keyCode === Keys.enter) {
    e.preventDefault()
  }

  switch (keyCode) {
    case Keys.space:
      if (orbitSearchResultsStore.isSelectingContent) {
        return
      }
      if (queryStore.prefixFirstWord) {
        if (
          !appsCarouselStore.focusedApp ||
          appsCarouselStore.focusedApp.identifier === 'searchResults'
        ) {
          return
        }
        appsCarouselStore.zoomIntoCurrentApp()
      }
      return
    case Keys.enter:
      if (orbitSearchResultsStore.shouldHandleEnter) {
        e.stopPropagation()
        orbitSearchResultsStore.handleEnter()
        return
      } else {
        queryStore.setLastCommand('enter')
      }
      return
  }
}

export const OrbitHeaderInput = memo(function OrbitHeaderInput({ fontSize }: { fontSize: number }) {
  // separate value here, lets us interface with queryStore/search, + will be useful for concurrent
  const [inputVal, setInputVal] = useState('')
  const search = useSearch({ react: false })!
  const qs = useQueryStore()
  const orbitWindowStore = useOrbitWindowStore()
  const headerStore = useHeaderStore()
  const activeTheme = useTheme()
  const [activeSpace] = useActiveSpace()
  const focusedApp = headerStore.paneState.focusedApp
  const placeholder = !focusedApp
    ? ''
    : (activeSpace &&
        (focusedApp.identifier === 'sources' ? `Manage ${activeSpace.name}` : focusedApp.name)) ||
      ''

  /**
   * We're doing a really ugly three way sync here...
   *
   *   QueryStore.query <-> Search.query <-> inputVal
   *
   *   Reasons?
   *     1. Search is part of UI to propogate list filtering / highlighting
   *     2. QueryStore is part of Kit, to be used by any app for NLP, accesing query
   *     3. local state because it has concurrent properties, we can keep it fast
   *
   */
  useReaction(
    () => queryStore.queryWithoutPrefix,
    async (val, { sleep }) => {
      if (val !== search.query) {
        await sleep(100)
        search.setQuery(val)
      }
    },
    {
      name: 'Sync to search store',
    },
  )

  const updateQuery = (next: string) => {
    setInputVal(next)
    queryStore.setQuery(next)
  }

  const onChangeQuery = useCallback(e => updateQuery(e.target.value), [])

  // if we clear the queryStore, clear the input
  useReaction(
    () => queryStore.hasQuery,
    hasQuery => {
      if (!hasQuery) {
        setInputVal('')
      }
    },
  )

  return (
    <FakeInput>
      <View height="100%" flex={1} position="relative" flexDirection="row" alignItems="center">
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
          highlight={headerStore.highlightWords as any}
          color={activeTheme.color}
          onChange={onChangeQuery}
          onFocus={orbitWindowStore.onFocus}
          onBlur={orbitWindowStore.onBlur}
          onKeyDown={handleKeyDown}
        />
      </View>
      <After>
        <ClearButton margin={['auto', 5]} invisible={!qs.hasQuery} onClick={qs.clearQuery} />
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
  flexDirection: 'row',
})

const FakeInput = gloss(View, {
  position: 'relative',
  height: 34,
  padding: [2, 12],
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  flex: 1,
  cursor: 'text',
  transition: 'none',
})
