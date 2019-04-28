import { createContextualProps, Theme, useIntersectionObserver } from '@o/ui'
import React, { lazy, Suspense, useRef, useState } from 'react'

import { bodyElement } from '../constants'
import { useSiteStore } from '../SiteStore'
import { Header } from '../views/Header'
import { Page } from '../views/Page'
import { Parallax } from '../views/Parallax'
import AllInOnePitchDemoSection from './HomePage/AllInOnePitchDemoSection'
import DeploySection from './HomePage/DeploySection'
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
          <Page offset={0} zIndex={0}>
            <HeadSection />
          </Page>
          <Page offset={1}>
            <AllInOnePitchDemoSection />
          </Page>
          <Page offset={2}>
            <DeploySection />
          </Page>
          <Page offset={3}>
            <DataAppKitFeaturesSection pages={2} />
          </Page>
          <Theme name="darkAlt">
            <Page offset={5} zIndex={1}>
              <EarlyAccessBetaSection />
            </Page>
            <Page offset={6}>
              <SecuritySection />
            </Page>
          </Theme>
          <Page offset={7}>
            <MissionMottoSection />
          </Page>
          <Page offset={8}>
            <Theme name="home">
              <FeetSection />
            </Theme>
          </Page>
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
        <Page.Content pages={props.pages}>
          <div
            className="intersect-div"
            style={{
              zIndex: 1000000000000,
              // background: 'red',
              width: 2,
              position: 'absolute',
              // makes it load "before/after" by this px
              top: -400,
              bottom: -400,
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
