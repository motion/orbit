import { AppBit, createUsableStore, ensure, HighlightActiveQuery, openItem, react, SearchState, useReaction, useSearchState } from '@o/kit'
import { FullScreen, FullScreenProps, linearGradient, List, ListItemProps, normalizeItem, ProvideVisibility, Row, SelectableStore, SubTitle, Theme, useTheme, View } from '@o/ui'
import { Box, BoxProps, gloss, ThemeObject } from 'gloss'
import React, { memo, Suspense, useCallback, useMemo, useRef } from 'react'

import { SearchResultsApp } from '../../apps/SearchResultsApp'
import { om } from '../../om/om'
import { SearchStore } from '../../om/SearchStore'
import { appsDrawerStore } from '../../om/stores'
import { appsCarouselStore, useAppsCarousel } from './OrbitAppsCarouselStore'

class OrbitSearchResultsStore {
  searchState: SearchState | null = null
  setSearchState = next => {
    this.searchState = next
  }

  updateSearchResultsStore = react(
    () => this.searchState,
    async (next, { when }) => {
      if (next) {
        await when(() => this.isActive)
        SearchStore.setSearchState(next)
      }
    },
  )

  get isActive() {
    return !appsCarouselStore.zoomedIn && !appsDrawerStore.isOpen
  }

  selectedItem: { type: 'app' | 'content'; index: number } = { type: 'app', index: -1 }
  setSelectedItem(item: ListItemProps, index: number) {
    this.selectedItem = {
      type: this.isApp(item) ? 'app' : 'content',
      index,
    }
  }

  get selectedRow() {
    return SearchStore.results[this.selectedItem.index]
  }

  // we can select apps that aren't in the search results
  // so this index may be -1, which is fine and wont break anything
  setSelectedApp = (appId: number) => {
    if (!SearchStore) return
    const index = SearchStore.results.findIndex(x => x.extraData && +x.extraData.id === appId)
    this.selectedItem = {
      type: 'app',
      index,
    }
  }

  isApp(row: ListItemProps) {
    return row && row.extraData && row.extraData.app
  }

  // handlers for actions
  get shouldHandleEnter() {
    if (!this.isActive) return false
    if (!this.selectedRow) return false
    return true
  }
  handleEnter() {
    const row = this.selectedRow
    if (!row) return
    if (this.isApp(row)) {
      appsCarouselStore.zoomIntoCurrentApp()
    } else {
      const item = row.item
      if (!item) return
      const normalized = normalizeItem(item)
      if (normalized.locationLink) {
        openItem(normalized.locationLink)
      } else {
        // we should show a banner here
        console.warn('item doesnt have a location link!')
      }
    }
  }

  get isSelectingContent() {
    if (!this.isActive) return false
    if (!this.selectedRow) return false
    return !this.isApp(this.selectedRow)
  }

  lastSelect = Date.now()
  reactToItem = react(
    () => this.selectedRow,
    async (row, { sleep }) => {
      const timeSinceLastSelect = Date.now() - this.lastSelect
      this.lastSelect = Date.now()

      // set hidden quickly because animations will start in this view
      appsCarouselStore.setHidden(this.selectedItem.type !== 'app')

      if (!row) {
        return
      }

      if (timeSinceLastSelect < 100) {
        await sleep(100)
      }

      if (this.isSelectingContent) {
        // onSelect Bit
        om.actions.setShare({
          id: `app-search-results`,
          value: {
            id: +`${row.id}`,
            name: 'Search Results',
            identifier: 'searchResults',
            items: [row],
          },
        })
      } else {
        if (row.extraData && row.extraData.app) {
          // onSelect App
          const app: AppBit = row.extraData.app
          const carouselIndex = appsCarouselStore.apps.findIndex(x => x.id === app.id)
          if (carouselIndex === -1) return
          appsCarouselStore.animateAndScrollTo(carouselIndex)
        }
      }
    },
    {
      lazy: true,
    },
  )
}
export const orbitSearchResultsStore = createUsableStore(OrbitSearchResultsStore)
window['orbitSearchResultsStore'] = orbitSearchResultsStore

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
          rotateY: '2deg',
          scale: 1,
          x: 0,
        },
      }

  const highlightTheme: ThemeObject = useMemo(() => {
    return {
      ...theme,
      alternates: {
        ...theme.alternates!,
        selected: {
          ...theme.alternates!.selected,
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
        height="102%"
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
  const theme = useTheme()
  return (
    <View padding={[38, 8, 16]}>
      <SubTitle>{props.children}</SubTitle>
    </View>
  )
}
