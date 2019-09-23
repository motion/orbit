import { ErrorBoundary, Loading, Theme, useIntersectionObserver, View } from '@o/ui'
import { once } from 'lodash'
import React, { lazy, memo, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { requestIdleCallback } from '../etc/requestIdle'
import { Header } from '../Header'
import { Page } from '../views/Page'
import { HeadSection } from './HomePage/HeadSection'
import { LoadingPage } from './LoadingPage'

const Sections = {
  DeploySection: loadOnIntersect(lazy(() => retry(() => import('./HomePage/DeploySection')))),
  AllInOnePitchDemoSection: loadOnIntersect(
    lazy(() => retry(() => import('./HomePage/AllInOnePitchDemoSection'))),
  ),
  DataAppKitFeaturesSection: loadOnIntersect(
    lazy(() => retry(() => import('./HomePage/DataAppKitFeaturesSection'))),
  ),
  FeaturesSection: loadOnIntersect(lazy(() => retry(() => import('./HomePage/FeaturesSection')))),
  SecuritySection: loadOnIntersect(lazy(() => retry(() => import('./HomePage/SecuritySection')))),
  FooterSection: loadOnIntersect(lazy(() => retry(() => import('./HomePage/FooterSection')))),
  IntroSection: loadOnIntersect(lazy(() => retry(() => import('./HomePage/IntroSection')))),
}

export const HomePage = memo(() => {
  return (
    <>
      <LoadingPage />
      <View background="#000" borderBottom={[1, [255, 255, 255, 0.12]]} height={8} width="100%" />
      <Header />
      <main
        className="main-contents"
        style={{ position: 'relative', zIndex: 0, overflow: 'hidden' }}
      >
        <Page pages="auto" zIndex={0}>
          <HeadSection />
        </Page>
        <Page pages="auto">
          <Sections.FeaturesSection />
        </Page>
        <Page pages="auto">
          <Sections.AllInOnePitchDemoSection />
        </Page>
        <Page pages="auto">
          <Sections.IntroSection />
        </Page>
        <Page pages="auto">
          <Sections.DeploySection />
        </Page>
        <Page pages="auto">
          <Sections.DataAppKitFeaturesSection />
        </Page>
        <Page pages="auto">
          <Sections.SecuritySection />
        </Page>
        <Page pages="auto">
          <Theme name="home">
            <Sections.FooterSection hideJoin />
          </Theme>
        </Page>
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
  // let them all add
  await new Promise(res => setTimeout(res, 3000))
  // load rest of page
  while (allUpcoming.length) {
    await onIdle()
    await new Promise(res => setTimeout(res, 400))
    const next = allUpcoming.reduce((a, b) => (b.top < a.top ? b : a), { top: Infinity })
    console.log('loading', next)
    next.load()
    allUpcoming.splice(allUpcoming.findIndex(x => x.load === next.load), 1)
  }
})

function loadOnIntersect(Component: any) {
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
    // or load the previous when its above
    useLayoutEffect(() => {
      const top = ref.current.getBoundingClientRect().y

      // because we have auto sized heights we load everything above immediately
      if (document.documentElement.scrollTop > top) {
        setShow(true)
      } else {
        allUpcoming.push({
          top,
          load: () => setShow(true),
        })
        startLoading()
      }
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
            top: -200,
            bottom: -200,
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
      <ErrorBoundary name={`${Component.name}`}>
        <Suspense fallback={fallback}>
          <Component {...props} />
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
