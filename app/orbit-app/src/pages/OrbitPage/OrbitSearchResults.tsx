import { useSearchState } from '@o/kit'
import { FullScreen, FullScreenProps, List, SubTitle, Theme, useTheme, View } from '@o/ui'
import React, { memo, useMemo } from 'react'

import { SearchStore } from '../../stores/SearchStore'
import { useAppsCarousel } from './OrbitAppsCarousel'

export const OrbitSearchResults = memo(() => {
  const theme = useTheme()
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

  return (
    <View
      className="orbit-search-results"
      perspective="1000px"
      position="absolute"
      left={0}
      top={0}
      bottom={0}
      zIndex={1000}
      width="44%"
      transition="all ease 300ms"
      background="linear-gradient(to right, rgba(0,0,0,0.3) 15%, transparent)"
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
            items={searchStore.results}
            Separator={ListSeparatorLarge}
          />
        </Theme>
      </FullScreen>
    </View>
  )
})

function ListSeparatorLarge(props: { children: string }) {
  return (
    <View padding={[38, 8, 16]}>
      <SubTitle>{props.children}</SubTitle>
    </View>
  )
}
