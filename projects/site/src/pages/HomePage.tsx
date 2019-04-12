import { Theme } from '@o/ui'
import { createStoreContext } from '@o/use-store'
import React, { useEffect } from 'react'
import { Parallax } from '../views/Parallax'
import { ChestSection } from './HomePage/ChestSection'
// import { Parallax } from 'react-spring/renderprops-addons'
import { HeadSection } from './HomePage/HeadSection'
import { NeckSection } from './HomePage/NeckSection'
import { ShoulderSection } from './HomePage/ShoulderSection'

class HomeStore {
  windowHeight = window.innerHeight

  get sectionHeight() {
    return Math.min(
      // min-height
      Math.max(800, this.windowHeight),
      // max-height
      1000,
    )
  }
}

const { SimpleProvider, useStore, useCreateStore } = createStoreContext(HomeStore)
export const useHomestore = useStore

export function HomePage() {
  const homeStore = useCreateStore()

  useEffect(() => {
    window.addEventListener('resize', () => {
      homeStore.windowHeight = window.innerHeight
    })
  })

  console.log('homeStore.sectionHeight', homeStore.sectionHeight)

  return (
    <Theme name="home">
      <SimpleProvider value={homeStore}>
        <Parallax
          pages={4}
          // ref={ref => (this.parallax = ref)}
          scrollingElement={window}
          container={document.documentElement}
          pageHeight={homeStore.sectionHeight}
        >
          <HeadSection />
          <NeckSection />
          <ShoulderSection />
          <ChestSection />
        </Parallax>
      </SimpleProvider>
    </Theme>
  )
}

HomePage.path = ''
HomePage.navigationOptions = {
  title: 'Home',
  linkName: 'Home Page',
}
