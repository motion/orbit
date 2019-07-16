import { AppBit, ensure, HighlightActiveQuery, useReaction, useSearchState } from '@o/kit'
import { FullScreen, FullScreenProps, linearGradient, List, ProvideVisibility, SelectableStore, SubTitle, Theme, useTheme, View } from '@o/ui'
import { ThemeObject } from 'gloss'
import React, { memo, useCallback, useMemo, useRef } from 'react'

import { SearchStore } from '../../stores/SearchStore'
import { appsCarouselStore, useAppsCarousel } from './OrbitAppsCarousel'
import { appsDrawerStore } from './OrbitAppsDrawer'

export const OrbitSearchResults = memo(() => {
  const theme = useTheme()
  const appsDrawer = appsDrawerStore.useStore()
  const carousel = useAppsCarousel()
  const searchStore = SearchStore.useStore()!
  const listRef = useRef<SelectableStore>(null)

  window['searchStore'] = searchStore

  console.log('render OrbitSearchResults', searchStore.results)

  useSearchState({
    includePrefix: true,
    onChange: state => {
      searchStore.setSearchState(state)
    },
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

  const highlightTheme: ThemeObject = useMemo(
    () => ({
      ...theme,
      alternates: {
        ...theme.alternates!,
        selected: {
          ...theme.alternates!.selected,
          listItemBackground: linearGradient(
            'to right',
            theme.background.isDark() ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
            'transparent',
          ),
        },
      },
    }),
    [theme],
  )

  /**
   * BEWARE! TWO WAY SYNC AHEAD
   */
  const ignoreNextSelect = useRef(false)

  // sync to carousel from selection
  const handleSelect = useCallback(rows => {
    if (ignoreNextSelect.current) {
      ignoreNextSelect.current = false
      return
    }
    const item = rows[0]
    if (!item) return
    if (item.extraData && item.extraData.app) {
      const app: AppBit = item.extraData.app
      const carouselIndex = appsCarouselStore.apps.findIndex(x => x.id === app.id)
      if (carouselIndex === -1) return
      appsCarouselStore.animateAndScrollTo(carouselIndex)
    } else {
      const carouselIndex = appsCarouselStore.apps.findIndex(x => x.identifier === 'bit')
      if (carouselIndex === -1) return
      appsCarouselStore.animateAndScrollTo(carouselIndex)
    }
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
          await sleep(100)
          listRef.current.setActiveIndex(listIndex)
        }
      }
    },
  )

  const isActive = !carousel.zoomedIn && !appsDrawer.isOpen

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
