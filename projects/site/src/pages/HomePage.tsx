import { ErrorBoundary, Loading, Theme, useIntersectionObserver } from '@o/ui'
import { once } from 'lodash'
import React, { lazy, memo, Suspense, useEffect, useRef, useState } from 'react'

import { requestIdleCallback } from '../etc/requestIdle'
import { Header } from '../Header'
import { Page } from '../views/Page'
import AllInOnePitchDemoSection from './HomePage/AllInOnePitchDemoSection'
import { HeadSection } from './HomePage/HeadSection'
import { LoadingPage } from './LoadingPage'

const DeploySection = loadOnIntersect(lazy(() => retry(() => import('./HomePage/DeploySection'))))
// const AllInOnePitchDemoSection = loadOnIntersect(
//   lazy(() => retry(() => import('./HomePage/AllInOnePitchDemoSection'))),
// )
const DataAppKitFeaturesSection = loadOnIntersect(
  lazy(() => retry(() => import('./HomePage/DataAppKitFeaturesSection'))),
)
const FooterSection = loadOnIntersect(lazy(() => retry(() => import('./HomePage/FooterSection'))))
const MissionMottoSection = loadOnIntersect(
  lazy(() => retry(() => import('./HomePage/MissionMottoSection'))),
)
const SecuritySection = loadOnIntersect(
  lazy(() => retry(() => import('./HomePage/SecuritySection'))),
)
// const EarlyAccessBetaSection = loadOnIntersect(
//   lazy(() => retry(() => import('./HomePage/EarlyAccessBetaSection'))),
// )

export const HomePage = memo(() => {
  return (
    <>
      <LoadingPage />
      <Header />
      <main className="main-contents" style={{ position: 'relative', zIndex: 0 }}>
        <Page>
          <HeadSection />
        </Page>
        <Page>
          <AllInOnePitchDemoSection />
        </Page>
        {true && (
          <>
            <Page>
              <DeploySection />
            </Page>
            <Page pages={1.5}>
              <DataAppKitFeaturesSection />
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
          </>
        )}
      </main>
    </>
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
