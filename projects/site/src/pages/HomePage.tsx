import { Theme } from '@o/ui'
import React from 'react'
import { useSiteStore } from '../SiteStore'
import { Parallax } from '../views/Parallax'
import { ChestSection } from './HomePage/ChestSection'
// import { Parallax } from 'react-spring/renderprops-addons'
import { HeadSection } from './HomePage/HeadSection'
import { NeckSection } from './HomePage/NeckSection'
import { ShoulderSection } from './HomePage/ShoulderSection'

export function HomePage() {
  const siteStore = useSiteStore()
  console.log('siteStore.sectionHeight', siteStore.sectionHeight)
  return (
    <Theme name="home">
      <Parallax
        pages={4}
        // ref={ref => (this.parallax = ref)}
        scrollingElement={window}
        container={document.documentElement}
        pageHeight={siteStore.sectionHeight}
      >
        <HeadSection />
        <NeckSection />
        <ShoulderSection />
        <ChestSection />
      </Parallax>
    </Theme>
  )
}

HomePage.path = ''
HomePage.navigationOptions = {
  title: 'Home',
  linkName: 'Home Page',
}
