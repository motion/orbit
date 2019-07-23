import { AppBit, ensure, HighlightActiveQuery, react, useReaction, useSearchState, useStore } from '@o/kit'
import { FullScreen, FullScreenProps, linearGradient, List, ListItemProps, ProvideVisibility, SelectableStore, SubTitle, Theme, useTheme, View } from '@o/ui'
import { ThemeObject } from 'gloss'
import React, { memo, useCallback, useMemo, useRef } from 'react'

import { om } from '../../om/om'
import { SearchStore } from '../../stores/SearchStore'
import { appsCarouselStore, useAppsCarousel } from './OrbitAppsCarousel'
import { appsDrawerStore } from './OrbitAppsDrawer'

class SearchResultsStore {
  props: {
    searchStore: SearchStore
  }

  searchState = null

  setSearchState = next => {
    this.searchState = next
  }

  updateSearchResultsStore = react(
    () => this.searchState,
    async (next, { when }) => {
      await when(() => this.isActive)
      await when(() => !appsCarouselStore.isAnimating)
      this.props.searchStore.setSearchState(next)
    },
  )

  get isActive() {
    return !appsCarouselStore.zoomedIn && !appsDrawerStore.isOpen
  }

  rows: ListItemProps[] = []

  setRows(rows: ListItemProps[]) {
    this.rows = rows
  }

  reactToItem = react(
    () => this.rows,
    async (rows, { sleep }) => {
      const item = rows[0]
      if (!item) return
      // lets not be super greedy here
      await sleep(100)
      if (item.extraData && item.extraData.app) {
        // onSelect App
        const app: AppBit = item.extraData.app
        const carouselIndex = appsCarouselStore.apps.findIndex(x => x.id === app.id)
        if (carouselIndex === -1) return
        appsCarouselStore.animateAndScrollTo(carouselIndex)
      } else {
        // onSelect Bit
        const carouselIndex = appsCarouselStore.apps.findIndex(
          x => x.identifier === 'searchResults',
        )
        if (carouselIndex === -1) return
        appsCarouselStore.animateAndScrollTo(carouselIndex)

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

export const OrbitSearchResults = memo(() => {
  const theme = useTheme()
  const appsDrawer = appsDrawerStore.useStore()
  const searchStore = SearchStore.useStore()!
  const searchResultsStore = useStore(SearchResultsStore, { searchStore })
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
    () => appsCarouselStore.apps[appsCarouselStore.focusedIndex],
    async (app, { sleep }) => {
      ensure('app', !!app)
      const listIndex = searchStore.results.findIndex(
        x => x.extraData && x.extraData.app && x.extraData.app.id === app.id,
      )
      if (listRef.current && listIndex > -1) {
        if (listRef.current.activeIndex !== listIndex) {
          ignoreNextSelect.current = true
          console.log('set active index from reaction', listIndex)
          await sleep(70)
          listRef.current.setActiveIndex(listIndex)
        }
      }
    },
  )

  return (
    <ProvideVisibility visible={isActive}>
      <View
        className="orbit-search-results"
        perspective="1000px"
        position="absolute"
        left={0}
        top={0}
        bottom={0}
        zIndex={200}
        width="40%"
        transition="all ease 300ms"
        background="linear-gradient(to right, rgba(0,0,0,0.3) 15%, transparent 90%)"
        opacity={carousel.zoomedIn ? 0 : 1}
        pointerEvents={isActive ? 'auto' : 'none'}
      >
        <FullScreen
          transition="all ease 300ms"
          transformOrigin="left center"
          paddingRight="10%"
          {...carouselProps}
        >
          <Theme theme={highlightTheme}>
            <HighlightActiveQuery query={searchStore.searchedQuery}>
              <List
                ref={listRef}
                alwaysSelected
                shareable
                selectable
                itemProps={useMemo(
                  () => ({
                    iconBefore: true,
                    iconSize: 42,
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
    </ProvideVisibility>
  )
})

function ListSeparatorLarge(props: { children: string }) {
  return (
    <View padding={[38, 8, 16]}>
      <SubTitle>{props.children}</SubTitle>
    </View>
  )
}
