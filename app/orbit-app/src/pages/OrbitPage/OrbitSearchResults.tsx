import { useSearchState } from '@o/kit'
import { FullScreen, FullScreenProps, List, SubTitle, View } from '@o/ui'
import React, { memo, useMemo } from 'react'

import { SearchStore } from '../../stores/SearchStore'
import { useAppsCarousel } from './OrbitAppsCarousel'

export const OrbitSearchResults = memo(() => {
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
          rotateY: '-10deg',
          scale: 0.7,
          x: -100,
        },
      }
    : {
        transform: {
          rotateY: '7deg',
          scale: 0.9,
          x: 0,
        },
      }
  return (
    <View
      perspective="1000px"
      position="absolute"
      top="-10%"
      bottom="-10%"
      left={0}
      zIndex={1000}
      width="44%"
      transition="all ease 400ms"
      background="linear-gradient(to right, rgba(0,0,0,0.3) 15%, transparent)"
      opacity={carousel.zoomedIn ? 0 : 1}
    >
      <FullScreen
        transition="all ease 400ms"
        transformOrigin="left center"
        paddingTop="5%"
        paddingBottom="5%"
        paddingRight="10%"
        {...carouselProps}
      >
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
