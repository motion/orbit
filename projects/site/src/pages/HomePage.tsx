import React from 'react'
import { useSiteStore } from '../Layout'
import { Header } from '../views/Header'
import { Page } from '../views/Page'
import { Parallax } from '../views/Parallax'
import { NeckSection } from './HomePage/DemoSection'
import { ShoulderSection } from './HomePage/DeploySection'
import { AbdomenSection } from './HomePage/EarlyAccessSection'
import { ChestSection } from './HomePage/FeaturesSection'
import { FeetSection } from './HomePage/FooterSection'
// import { Parallax } from 'react-spring/renderprops-addons'
import { HeadSection } from './HomePage/HeadSection'
import { LegsSection } from './HomePage/MissionMottoSection'
import { WaistSection } from './HomePage/SecuritySection'

export function HomePage() {
  const siteStore = useSiteStore()
  return (
    <>
      <Header key="header" />
      <Parallax
        pages={9}
        // ref={ref => (this.parallax = ref)}
        scrollingElement={window}
        container={document.documentElement}
        pageHeight={siteStore.sectionHeight}
      >
        <HeadSection offset={0} />
        <NeckSection offset={1} />
        <ShoulderSection offset={2} />
        <ChestSection offset={3} />
        <Page offset={4} zIndex={-2}>
          <Page.Content pointerEvents="none" />
        </Page>
        <AbdomenSection offset={5} />
        <WaistSection offset={6} />
        <LegsSection offset={7} />
        <FeetSection offset={8} />
      </Parallax>
    </>
  )
}

HomePage.theme = 'home'
