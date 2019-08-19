import { AppBit, createUsableStore, ensure, HighlightActiveQuery, openItem, react, SearchState, useReaction, useSearchState } from '@o/kit'
import { FullScreen, FullScreenProps, linearGradient, List, ListItemProps, normalizeItem, ProvideVisibility, Row, SelectableStore, SubTitle, Theme, useTheme, View } from '@o/ui'
import { Box, BoxProps, gloss, ThemeObject } from 'gloss'
import React, { memo, Suspense, useCallback, useMemo, useRef } from 'react'

import { SearchResultsApp } from '../../apps/SearchResultsApp'
import { om } from '../../om/om'
import { SearchStore, SearchStoreStore } from '../../stores/SearchStore'
import { appsCarouselStore, useAppsCarousel } from './OrbitAppsCarousel'
import { appsDrawerStore } from './OrbitAppsDrawer'

class OrbitSearchResultsStore {
  // @ts-ignore
  props: {
    searchStore: SearchStoreStore
  }

  searchState: SearchState | null = null

  setSearchState = next => {
    this.searchState = next
  }

  updateSearchResultsStore = react(
    () => this.searchState,
    async (next, { when }) => {
      if (next) {
        await when(() => this.isActive)
        this.props.searchStore.setSearchState(next)
      }
    },
  )

  get isActive() {
    return !appsCarouselStore.zoomedIn && !appsDrawerStore.isOpen
  }

  selectedRows: ListItemProps[] = []
  setRows(rows: ListItemProps[]) {
    this.selectedRows = rows
  }

  isApp(row: ListItemProps) {
    return row.extraData && row.extraData.app
  }

  // handlers for actions
  get shouldHandleEnter() {
    if (!this.isActive) return false
    if (!this.selectedRows.length) return false
    return true
  }
  handleEnter() {
    const row = this.selectedRows[0]
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
    if (!this.selectedRows.length) return false
    return !this.isApp(this.selectedRows[0])
  }

  reactToItem = react(
    () => this.selectedRows,
    async (rows, { sleep }) => {
      const item = rows[0]
      if (!item) return
      // lets not be super greedy here
      await sleep(100)
      if (item.extraData && item.extraData.app) {
        appsCarouselStore.setHidden(false)
        // onSelect App
        const app: AppBit = item.extraData.app
        const carouselIndex = appsCarouselStore.apps.findIndex(x => x.id === app.id)
        if (carouselIndex === -1) return
        appsCarouselStore.animateAndScrollTo(carouselIndex)
      } else {
        // onSelect Bit

        appsCarouselStore.setHidden()

        // to scroll to SearchResultsApp in carousel...
        // const carouselIndex = appsCarouselStore.apps.findIndex(
        //   x => x.identifier === 'searchResults',
        // )
        // if (carouselIndex === -1) return
        // appsCarouselStore.animateAndScrollTo(carouselIndex)

        om.actions.setShare({
          id: `app-search-results`,
          value: {
            id: +`${item.id}`,
            name: 'Search Results',
            identifier: 'searchResults',
            items: rows,
          },
        })
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
  const theme = useTheme()
  const searchStore = SearchStore.useStore()!
  const searchResultsStore = orbitSearchResultsStore.useStore()
  orbitSearchResultsStore.setProps({ searchStore })
  const isActive = searchResultsStore.isActive
  const carousel = useAppsCarousel()
  const listRef = useRef<SelectableStore>(null)

  window['searchStore'] = searchStore

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
          listItemBackground: linearGradient(
            'to right',
            theme.background.isDark() ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.015)',
            'transparent',
          ),
        },
      },
    }
  }, [theme])

  /**
   * BEWARE! TWO WAY SYNC AHEAD
   */
  const ignoreNextSelect = useRef(false)

  // sync to carousel from selection
  const handleSelect = useCallback(rows => {
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
    searchResultsStore.setRows(rows)
  }, [])

  // sync from carousel to list
  useReaction(
    () => appsCarouselStore.focusedIndex,
    async (index, { sleep }) => {
      const app = appsCarouselStore.apps[index]
      ensure('app', !!app)
      ensure('not hidden', !appsCarouselStore.hidden)
      const listIndex = searchStore.results.findIndex(
        x => x.extraData && x.extraData.app && x.extraData.app.id === app.id,
      )
      if (listRef.current && listIndex > -1) {
        if (listRef.current.activeIndex !== listIndex) {
          ignoreNextSelect.current = true
          await sleep(70)
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
        perspective="1000px"
        pointerEvents="none"
      >
        <View
          data-is="OrbitSearchResults-Index"
          zIndex={200}
          width="36%"
          transition="all ease 300ms"
          background="linear-gradient(to right, rgba(0,0,0,0.3) 15%, transparent 90%)"
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
                        size: 1.1,
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
  transition: 'all ease 300ms',
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
