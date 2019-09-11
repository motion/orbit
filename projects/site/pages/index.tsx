import { Theme } from '@o/ui'
import React, { lazy, memo, Suspense, useEffect, useRef, useState } from 'react'

import { requestIdleCallback } from '../src/etc/requestIdle'
import { Header } from '../src/Header'
import { useIsTiny } from '../src/hooks/useScreenSize'
import AllInOnePitchDemoSection from '../src/pages/HomePage/AllInOnePitchDemoSection'
import DataAppKitFeaturesSection from '../src/pages/HomePage/DataAppKitFeaturesSection'
import DeploySection from '../src/pages/HomePage/DeploySection'
import EarlyAccessBetaSection from '../src/pages/HomePage/EarlyAccessBetaSection'
import FooterSection from '../src/pages/HomePage/FooterSection'
import { HeadSection } from '../src/pages/HomePage/HeadSection'
import MissionMottoSection from '../src/pages/HomePage/MissionMottoSection'
import SecuritySection from '../src/pages/HomePage/SecuritySection'
import { LoadingPage } from '../src/pages/LoadingPage'
import { ParallaxContext } from '../src/pages/ParallaxContext'
import { useSiteStore } from '../src/SiteStore'
import { Page } from '../src/views/Page'

export default () => {
  const siteStore = useSiteStore()
  const [parallax, setParallax] = useState(null)
  const isTiny = useIsTiny()

  return (
    <ParallaxContext.PassProps value={parallax}>
      <LoadingPage />
      <Header />
      <main className="main-contents" style={{ position: 'relative', zIndex: 0 }}>
        <Page>
          <HeadSection />
        </Page>
        <Page>
          <AllInOnePitchDemoSection />
        </Page>
        <Page>
          <DeploySection />
        </Page>
        <Page pages={2}>
          <DataAppKitFeaturesSection />
        </Page>
        <Page>
          <EarlyAccessBetaSection />
        </Page>
        <Page>
          <SecuritySection />
        </Page>
        <Page>
          <MissionMottoSection />
        </Page>
        <Page>
          <Theme name="home">
            <FooterSection hideJoin />
          </Theme>
        </Page>
      </main>
    </ParallaxContext.PassProps>
  )
}

// @ts-ignore
HomePage.theme = 'home'
// @ts-ignore
HomePage.showPeekHeader = true

let allUpcoming = []

const onIdle = () => new Promise(res => requestIdleCallback(res))
