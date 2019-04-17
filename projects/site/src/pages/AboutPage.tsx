import '@o/nucleo'
import React from 'react'
import { IS_CHROME } from '../constants'
import { useSiteStore } from '../Layout'
import { Header } from '../views/Header'
import { Parallax } from '../views/Parallax'
import { FeetSection } from './HomePage/FooterSection'
import { LegsSection } from './HomePage/MissionMottoSection'

export function AboutPage() {
  const siteStore = useSiteStore()

  return (
    <>
      <Header slim />
      <Parallax
        pages={2}
        scrollingElement={window}
        container={IS_CHROME ? document.documentElement : document.body}
        pageHeight={siteStore.sectionHeight}
      >
        <LegsSection offset={0} />
        <FeetSection offset={1} />
      </Parallax>
    </>
  )
}

AboutPage.theme = 'home'
