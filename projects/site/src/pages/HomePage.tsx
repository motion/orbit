import { createContextualProps, FullScreen } from '@o/ui'
import { throttle } from 'lodash'
import React, { useEffect, useState } from 'react'
import { IS_CHROME } from '../constants'
import { useSiteStore } from '../Layout'
import { Header } from '../views/Header'
import { Parallax } from '../views/Parallax'
import { NeckSection } from './HomePage/AllInOnePitchDemoSection'
import { ChestSection } from './HomePage/DataAppKitFeaturesSection'
import { ShoulderSection } from './HomePage/DeploySection'
import { EarlyAccessSection } from './HomePage/EarlyAccessBetaSection'
import { FeetSection } from './HomePage/FooterSection'
import { HeadSection } from './HomePage/HeadSection'
import { LegsSection } from './HomePage/MissionMottoSection'
import { WaistSection } from './HomePage/SecuritySection'

const ParallaxContext = createContextualProps<{ value: Parallax }>({ value: null })
export const useParallax = () => {
  return ParallaxContext.useProps().value
}

export function HomePage() {
  const siteStore = useSiteStore()
  const [parallax, setParallax] = useState<Parallax>(null)

  return (
    <ParallaxContext.PassProps value={parallax}>
      <Header />
      <PeekHeader />
      <main>
        <Parallax
          ref={setParallax}
          pages={9}
          scrollingElement={window}
          container={IS_CHROME ? document.documentElement : document.body}
          pageHeight={siteStore.sectionHeight}
        >
          <HeadSection offset={0} />
          <NeckSection offset={1} />
          <ShoulderSection offset={2} />
          <ChestSection offset={3} />
          <EarlyAccessSection offset={5} />
          <WaistSection offset={6} />
          <LegsSection offset={7} />
          <FeetSection offset={8} />
        </Parallax>
      </main>
    </ParallaxContext.PassProps>
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
      <Header slim boxShadow={[[0, 0, 30, [0, 0, 0, 1]]]} />
    </FullScreen>
  )
}
