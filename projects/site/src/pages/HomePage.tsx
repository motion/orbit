import { FullScreen } from '@o/ui'
import { throttle } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useSiteStore } from '../Layout'
import { Header } from '../views/Header'
import { Parallax } from '../views/Parallax'
import { NeckSection } from './HomePage/AllInOnePitchDemoSection'
import { ChestSection } from './HomePage/AppKitFeaturesSection'
import { ShoulderSection } from './HomePage/DeploySection'
import { AbdomenSection } from './HomePage/EarlyAccessBetaSection'
import { FeetSection } from './HomePage/FooterSection'
// import { Parallax } from 'react-spring/renderprops-addons'
import { HeadSection } from './HomePage/HeadSection'
import { LegsSection } from './HomePage/MissionMottoSection'
import { WaistSection } from './HomePage/SecuritySection'

export function HomePage() {
  const siteStore = useSiteStore()
  return (
    <>
      <Header />
      <PeekHeader />
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
        {/* <Page offset={4} zIndex={-2}>
          <Page.Content pointerEvents="none" />
        </Page> */}
        <AbdomenSection offset={5} />
        <WaistSection offset={6} />
        <LegsSection offset={7} />
        <FeetSection offset={8} />
      </Parallax>
    </>
  )
}

HomePage.theme = 'home'

function PeekHeader() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = document.documentElement

    let top = el.scrollTop
    let direction: 'down' | 'up' = 'down'

    const onScroll = throttle(() => {
      const next = el.scrollTop
      direction = next >= top ? 'down' : 'up'

      // avoid small moves
      const diff = direction === 'down' ? next - top : top - next
      if (diff < 150) {
        return
      }

      top = next

      if (direction === 'up' && top > 300) {
        setShow(true)
      } else {
        setShow(false)
      }
    }, 100)

    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <FullScreen
      zIndex={100000000}
      position="fixed"
      bottom="auto"
      transition="all ease 200ms"
      opacity={show ? 1 : 0}
      transform={{ y: show ? 0 : -40 }}
    >
      <Header slim />
    </FullScreen>
  )
}
