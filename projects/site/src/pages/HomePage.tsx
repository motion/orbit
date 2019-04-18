import { createContextualProps } from '@o/ui'
import React, { useState } from 'react'
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
  try {
    return ParallaxContext.useProps().value
  } catch {
    return null
  }
}

export function HomePage() {
  const siteStore = useSiteStore()
  const [parallax, setParallax] = useState<Parallax>(null)

  return (
    <ParallaxContext.PassProps value={parallax}>
      <Header />
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
