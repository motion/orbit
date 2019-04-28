import { createContextualProps, Theme, useIntersectionObserver } from '@o/ui'
import React, { lazy, Suspense, useRef, useState } from 'react'

import { bodyElement } from '../constants'
import { useSiteStore } from '../SiteStore'
import { Header } from '../views/Header'
import { Page } from '../views/Page'
import { Parallax } from '../views/Parallax'
import { NeckSection } from './HomePage/AllInOnePitchDemoSection'
import { ShoulderSection } from './HomePage/DeploySection'
import { HeadSection } from './HomePage/HeadSection'
import { LoadingPage } from './LoadingPage'

const ParallaxContext = createContextualProps<{ value: Parallax }>({ value: null })
export const useParallax = () => {
  try {
    return ParallaxContext.useProps().value
  } catch {
    return null
  }
}

const DataAppKitFeaturesSection = loadOnIntersect(
  lazy(() => import('./HomePage/DataAppKitFeaturesSection')),
)
const FeetSection = loadOnIntersect(lazy(() => import('./HomePage/FooterSection')))
const MissionMottoSection = loadOnIntersect(lazy(() => import('./HomePage/MissionMottoSection')))
const SecuritySection = loadOnIntersect(lazy(() => import('./HomePage/SecuritySection')))
const EarlyAccessBetaSection = loadOnIntersect(
  lazy(() => import('./HomePage/EarlyAccessBetaSection')),
)

export function HomePage() {
  const siteStore = useSiteStore()
  const [parallax, setParallax] = useState<Parallax>(null)

  return (
    <ParallaxContext.PassProps value={parallax}>
      <LoadingPage />
      <Header />
      <main className="main-contents" style={{ position: 'relative', zIndex: 0 }}>
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
          <DataAppKitFeaturesSection offset={3} />
          <Theme name="darkAlt">
            <EarlyAccessBetaSection offset={5} />
            <SecuritySection offset={6} />
          </Theme>
          <MissionMottoSection offset={7} />
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

function loadOnIntersect(LazyComponent) {
  return props => {
    const hasIntersected = useRef(false)
    const ref = useRef(null)
    const intersect = useIntersectionObserver({ ref, options: { threshold: 0 } })
    const fallback = (
      <Page {...props}>
        <Page.Content>
          <div
            className="intersect-div"
            style={{
              zIndex: 1000000000000,
              background: 'red',
              width: 100,
              position: 'absolute',
              top: -300,
              bottom: -300,
            }}
            ref={ref}
          />
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
