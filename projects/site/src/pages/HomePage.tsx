import { ErrorBoundary, Loading, useIntersectionObserver } from '@o/ui'
import { once } from 'lodash'
import React, { lazy, memo, Suspense, useEffect, useRef, useState } from 'react'

import { requestIdleCallback } from '../etc/requestIdle'
import { Header } from '../Header'
import { Page } from '../views/Page'
import { HeadSection } from './HomePage/HeadSection'
import { LoadingPage } from './LoadingPage'
import { ParallaxContext } from './ParallaxContext'

const DeploySection = loadOnIntersect(
  lazy(() =>
    retry(() => import(/* webpackChunkName: "DeploySection" */ './HomePage/DeploySection')),
  ),
)
const AllInOnePitchDemoSection = loadOnIntersect(
  lazy(() =>
    retry(() =>
      import(
        /* webpackChunkName: "AllInOnePitchDemoSection" */ './HomePage/AllInOnePitchDemoSection'
      ),
    ),
  ),
)
const DataAppKitFeaturesSection = loadOnIntersect(
  lazy(() =>
    retry(() =>
      import(
        /* webpackChunkName: "DataAppKitFeaturesSection" */ './HomePage/DataAppKitFeaturesSection'
      ),
    ),
  ),
)
const FooterSection = loadOnIntersect(
  lazy(() =>
    retry(() => import(/* webpackChunkName: "FooterSection" */ './HomePage/FooterSection')),
  ),
)
const MissionMottoSection = loadOnIntersect(
  lazy(() =>
    retry(() =>
      import(/* webpackChunkName: "MissionMottoSection" */ './HomePage/MissionMottoSection'),
    ),
  ),
)
const SecuritySection = loadOnIntersect(
  lazy(() =>
    retry(() => import(/* webpackChunkName: "SecuritySection" */ './HomePage/SecuritySection')),
  ),
)
const EarlyAccessBetaSection = loadOnIntersect(
  lazy(() =>
    retry(() =>
      import(/* webpackChunkName: "EarlyAccessBetaSection" */ './HomePage/EarlyAccessBetaSection'),
    ),
  ),
)

export const HomePage = memo(() => {
  const [parallax, setParallax] = useState(null)

  return (
    <ParallaxContext.PassProps value={parallax}>
      <LoadingPage />
      <Header />
      <main className="main-contents" style={{ position: 'relative', zIndex: 0 }}>
        <Page>
          <HeadSection />
        </Page>
        {/* <Page>
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
        </Page> */}
      </main>
    </ParallaxContext.PassProps>
  )
})

// @ts-ignore
HomePage.theme = 'home'
// @ts-ignore
HomePage.showPeekHeader = true

let allUpcoming = []

const onIdle = () => new Promise(res => requestIdleCallback(res))

const startLoading = once(async () => {
  // let initial animation run
  await new Promise(res => setTimeout(res, 1000))
  // load rest of page
  while (allUpcoming.length) {
    await onIdle()
    await new Promise(res => setTimeout(res, 100))
    const next = allUpcoming.reduce((a, b) => (b.top < a.top ? b : a), { top: Infinity })
    next.load()
    allUpcoming.splice(allUpcoming.findIndex(x => x.load === next.load), 1)
  }
})

function loadOnIntersect(LazyComponent) {
  return props => {
    const [show, setShow] = useState(false)
    const ref = useRef(null)

    useIntersectionObserver({
      ref,
      options: { threshold: 0 },
      onChange(entries) {
        if (entries && entries[0].isIntersecting === true && !show) {
          setShow(true)
        }
      },
    })

    // preload them when ready
    useEffect(() => {
      allUpcoming.push({
        top: ref.current.getBoundingClientRect().y,
        load: () => setShow(true),
      })
      startLoading()
    }, [])

    const fallback = (
      <Page {...props}>
        <div
          className="intersect-div"
          style={{
            display: 'flex',
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
        <Loading />
      </Page>
    )

    if (!show) {
      return fallback
    }

    return (
      <ErrorBoundary name={`${LazyComponent.name}`}>
        <Suspense fallback={fallback}>
          <LazyComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    )
  }
}

function retry<A>(fn, retriesLeft = 5, interval = 1000) {
  return new Promise<A>((resolve, reject) => {
    fn()
      .then(resolve)
      .catch(error => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            // reject('maximum retries exceeded');
            reject(error)
            return
          }

          // Passing on "reject" is the important part
          retry(fn, retriesLeft - 1, interval).then(x => resolve(x as A), reject)
        }, interval)
      })
  })
}
