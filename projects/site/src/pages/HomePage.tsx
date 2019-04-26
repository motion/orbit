import { createContextualProps, Theme, useIntersectionObserver } from '@o/ui'
import React, { lazy, Suspense, useRef, useState } from 'react'

import { bodyElement } from '../constants'
import { useSiteStore } from '../SiteStore'
import { Header } from '../views/Header'
import { Page } from '../views/Page'
import { Parallax } from '../views/Parallax'
import { NeckSection } from './HomePage/AllInOnePitchDemoSection'
import { ChestSection } from './HomePage/DataAppKitFeaturesSection'
import { ShoulderSection } from './HomePage/DeploySection'
import { HeadSection } from './HomePage/HeadSection'

const ParallaxContext = createContextualProps<{ value: Parallax }>({ value: null })
export const useParallax = () => {
  try {
    return ParallaxContext.useProps().value
  } catch {
    return null
  }
}

const FeetSection = lazyScroll(lazy(() => import('./HomePage/FooterSection')))
const LegsSection = lazyScroll(lazy(() => import('./HomePage/MissionMottoSection')))
const WaistSection = lazyScroll(lazy(() => import('./HomePage/SecuritySection')))
const EarlyAccessSection = lazyScroll(lazy(() => import('./HomePage/EarlyAccessBetaSection')))

export function HomePage() {
  const siteStore = useSiteStore()
  const [parallax, setParallax] = useState<Parallax>(null)

  return (
    <ParallaxContext.PassProps value={parallax}>
      <Header />
      <main style={{ position: 'relative', zIndex: 0 }}>
        <Parallax
          ref={setParallax}
          pages={9}
          scrollingElement={window}
          container={bodyElement}
          pageHeight={siteStore.sectionHeight}
        >
          <HeadSection offset={0} />
          <NeckSection offset={1} />
          <ShoulderSection offset={2} />
          <ChestSection offset={3} />
          <Theme name="light">
            <EarlyAccessSection offset={5} />
          </Theme>
          <WaistSection offset={6} />
          <LegsSection offset={7} />
          <Theme name="home">
            <FeetSection offset={8} />
          </Theme>
        </Parallax>
      </main>
    </ParallaxContext.PassProps>
  )
}

HomePage.theme = 'home'
HomePage.showPeekHeader = true

function lazyScroll(LazyComponent) {
  return props => {
    const hasIntersected = useRef(false)
    const ref = useRef(null)
    const intersect = useIntersectionObserver({ ref, options: { threshold: 0.01 } })
    const fallback = (
      <Page {...props}>
        <Page.Content>
          <div style={{ position: 'absolute', top: -300, bottom: 0 }} ref={ref} />
        </Page.Content>
      </Page>
    )
    hasIntersected.current =
      hasIntersected.current || (intersect && intersect[0].isIntersecting === true)

    if (!hasIntersected.current) {
      return fallback
    }

    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}
