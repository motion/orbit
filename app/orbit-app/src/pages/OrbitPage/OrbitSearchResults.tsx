import { ensure, HighlightActiveQuery, useReaction, useSearchState } from '@o/kit'
import { FullScreen, FullScreenProps, linearGradient, List, ProvideVisibility, Row, SelectableStore, SubTitle, Theme, useTheme, View } from '@o/ui'
import { Box, BoxProps, gloss, ThemeObject } from 'gloss'
import React, { memo, Suspense, useCallback, useMemo, useRef } from 'react'

import { SearchResultsApp } from '../../apps/SearchResultsApp'
import { SearchStore } from '../../om/SearchStore'
import { appsDrawerStore } from '../../om/stores'
import { appsCarouselStore, useAppsCarousel } from './OrbitAppsCarouselStore'
import { orbitSearchResultsStore } from './OrbitSearchResultsStore'

export const OrbitSearchResults = memo(() => {
  const searchStore = SearchStore.useStore()
  const theme = useTheme()
  const searchResultsStore = orbitSearchResultsStore.useStore()
  const isActive = searchResultsStore.isActive
  const carousel = useAppsCarousel()
  const listRef = useRef<SelectableStore>(null)

  useSearchState({
    includePrefix: true,
    onChange: searchResultsStore.setSearchState,
  })

  const carouselProps: FullScreenProps = carousel.zoomedIn
    ? {
        transform: {
          rotateY: '-20deg',
          scale: 0.9,
          x: -200,
        },
      }
    : {
        transform: {
          // rotateY: '2deg',
          scale: 1,
          x: 0,
        },
      }

  const highlightTheme: ThemeObject = useMemo(() => {
    return {
      ...theme,
      coats: {
        ...theme.coats!,
        selected: {
          ...theme.coats!.selected,
          listItemBackground: theme.background.isDark()
            ? linearGradient('to right', 'rgba(255,255,255,0.2)', 'transparent')
            : theme.backgroundHighlight,
        },
      },
    }
  }, [theme])

  /**
   * BEWARE! TWO WAY SYNC AHEAD
   */
  const ignoreNextSelect = useRef(false)

  // sync to carousel from selection
  const handleSelect = useCallback((rows, indices) => {
    // avoid when zoomed in or in drawer
    if (appsCarouselStore.zoomedIn || appsDrawerStore.isOpen) {
      return
    }

    const item = rows[0]
    // sync to searchStore so we can use in SearchResultsApp
    searchStore.setSelectedItem(item)
    // ignore double
    if (ignoreNextSelect.current) {
      ignoreNextSelect.current = false
      return
    }
    searchResultsStore.setSelectedItem(item, indices[0])
  }, [])

  // sync from carousel to list
  useReaction(
    () => appsCarouselStore.focusedIndex,
    async index => {
      const app = appsCarouselStore.apps[index]
      ensure('app', !!app)
      ensure('not hidden', !appsCarouselStore.hidden)
      const listIndex = searchStore.results.findIndex(
        x => x.extraData && x.extraData.app && x.extraData.app.id === app.id,
      )
      if (listRef.current && listIndex > -1) {
        if (listRef.current.activeIndex !== listIndex) {
          ignoreNextSelect.current = true
          // await sleep(70)
          listRef.current.setActiveIndex(listIndex)
        }
      }
    },
  )

  return (
    <ProvideVisibility visible={isActive}>
      <Row
        data-is="OrbitSearchResults"
        width="100%"
        height="100%"
        perspective="1200px"
        pointerEvents="none"
        WebkitFontSmoothing="antialiased"
      >
        <View
          data-is="OrbitSearchResults-Index"
          zIndex={200}
          width="36%"
          transition="all ease 300ms"
          background={`linear-gradient(to right, ${theme.orbitLauncherSideBackground ||
            'transparent'} 15%, transparent 90%)`}
          opacity={carousel.zoomedIn ? 0 : 1}
          pointerEvents={isActive ? 'auto' : 'none'}
          perspective="1000px"
        >
          <FullScreen
            transition="all ease 300ms"
            transformOrigin="left center"
            paddingRight="5%"
            {...carouselProps}
          >
            <Theme theme={highlightTheme}>
              <HighlightActiveQuery query={searchStore.query.length > 2 ? searchStore.query : ''}>
                <List
                  ref={listRef}
                  alwaysSelected
                  shareable
                  selectable
                  itemProps={useMemo(
                    () => ({
                      iconBefore: true,
                      iconSize: 42,
                      activeStyle: false,
                      titleProps: {
                        size: 1.2,
                      },
                    }),
                    [],
                  )}
                  onSelect={handleSelect}
                  items={searchStore.results}
                  Separator={ListSeparatorLarge}
                />
              </HighlightActiveQuery>
            </Theme>
          </FullScreen>
        </View>

        <OrbitSearchedItem visible={searchResultsStore.isSelectingContent}>
          <Suspense fallback={null}>
            <SearchResultsApp />
          </Suspense>
        </OrbitSearchedItem>
      </Row>
    </ProvideVisibility>
  )
})

const OrbitSearchedItem = gloss<BoxProps & { visible: boolean }>(Box, {
  flex: 1,
  opacity: 0,
  transition: 'all ease 180ms',
  pointerEvents: 'none',
  transform: {
    rotateY: '-4deg',
    scale: 0.9,
    x: 15,
  },
  visible: {
    pointerEvents: 'auto',
    opacity: 1,
    transform: {
      rotateY: '0deg',
      scale: 1,
      x: 0,
    },
  },
})

function ListSeparatorLarge(props: { children: string }) {
  return (
    <View padding={[38, 8, 16]}>
      <SubTitle>{props.children}</SubTitle>
    </View>
  )
}
