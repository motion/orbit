import React, { useEffect } from 'react'
import { useSiteStore } from '../Body'
import { Header } from '../views/Header'
import { Parallax } from '../views/Parallax'
import { AbdomenSection } from './HomePage/AdbomenSection'
import { ChestSection } from './HomePage/ChestSection'
// import { Parallax } from 'react-spring/renderprops-addons'
import { HeadSection } from './HomePage/HeadSection'
import { NeckSection } from './HomePage/NeckSection'
import { ShoulderSection } from './HomePage/ShoulderSection'
import { WaistSection } from './HomePage/WaistSection'

export function HomePage() {
  const siteStore = useSiteStore()

  useEffect(() => {
    siteStore.setTheme('home')
  }, [])

  return (
    <>
      <Header key="header" />
      <Parallax
        pages={6}
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
      </Parallax>
    </>
  )
}
