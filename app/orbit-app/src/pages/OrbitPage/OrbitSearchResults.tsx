import { AppBit, useSearchState } from '@o/kit'
import { FullScreen, FullScreenProps, List, ProvideVisibility, SubTitle, Theme, useTheme, View } from '@o/ui'
import React, { memo, useCallback, useMemo } from 'react'

import { SearchStore } from '../../stores/SearchStore'
import { appsCarouselStore, useAppsCarousel } from './OrbitAppsCarousel'
import { appsDrawerStore } from './OrbitAppsDrawer'

export const OrbitSearchResults = memo(() => {
  const theme = useTheme()
  const appsDrawer = appsDrawerStore.useStore()
  const carousel = useAppsCarousel()
  const searchStore = SearchStore.useStore()!
  useSearchState({
    onChange: state => {
      console.log('got state', state)
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

  const highlightTheme = useMemo(
    () => ({
      ...theme,
      alternates: {
        ...theme.alternates,
        selected: {
          ...theme.alternates!.selected,
          background: 'linear-gradient(to right, rgba(255,255,255,0.2), transparent)',
        },
      },
    }),
    [theme],
  )

  const handleSelect = useCallback(rows => {
    const item = rows[0]
    if (item && item.extraData && item.extraData.app) {
      const app: AppBit = item.extraData.app
      const carouselIndex = appsCarouselStore.apps.findIndex(x => x.id === app.id)
      if (carouselIndex !== -1) {
        appsCarouselStore.animateAndScrollTo(carouselIndex)
      }
    }
  }, [])

  return (
    <ProvideVisibility visible={!carousel.zoomedIn && !appsDrawer.isOpen}>
      <View
        className="orbit-search-results"
        perspective="1000px"
        position="absolute"
        left={0}
        top={0}
        bottom={0}
        zIndex={1000}
        width="40%"
        transition="all ease 300ms"
        background="linear-gradient(to right, rgba(0,0,0,0.3) 15%, transparent 90%)"
        opacity={carousel.zoomedIn ? 0 : 1}
      >
        <FullScreen
          transition="all ease 300ms"
          transformOrigin="left center"
          paddingRight="10%"
          {...carouselProps}
        >
          <Theme theme={highlightTheme}>
            <List
              alwaysSelected
              shareable
              selectable
              query={searchStore.searchedQuery}
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
