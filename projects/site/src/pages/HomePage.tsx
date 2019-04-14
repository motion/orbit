import React from 'react'
import { useSiteStore } from '../Layout'
import { Header } from '../views/Header'
import { Parallax } from '../views/Parallax'
import { AbdomenSection } from './HomePage/AdbomenSection'
import { ChestSection } from './HomePage/ChestSection'
import { FeetSection } from './HomePage/FeetSection'
// import { Parallax } from 'react-spring/renderprops-addons'
import { HeadSection } from './HomePage/HeadSection'
import { LegsSection } from './HomePage/LegsSection'
import { NeckSection } from './HomePage/NeckSection'
import { ShoulderSection } from './HomePage/ShoulderSection'
import { WaistSection } from './HomePage/WaistSection'

export function HomePage() {
  const siteStore = useSiteStore()
  return (
    <>
      <Header key="header" />
      <Parallax
        pages={8}
        // ref={ref => (this.parallax = ref)}
        scrollingElement={window}
        container={document.documentElement}
        pageHeight={siteStore.sectionHeight}
      >
        <HeadSection />
        <NeckSection />
        <ShoulderSection />
        <ChestSection />
        <AbdomenSection />
        <WaistSection />
        <LegsSection />
        <FeetSection />
      </Parallax>
    </>
  )
}

HomePage.theme = 'home'
