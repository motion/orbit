import { mount, route } from 'navi'
import React from 'react'

import { bodyElement } from '../constants'
import { useSiteStore } from '../SiteStore'
import { Header } from '../views/Header'
import { Parallax } from '../views/Parallax'
import FeetSection from './HomePage/FooterSection'
import LegsSection from './HomePage/MissionMottoSection'

export default mount({
  '/': route({
    title: 'About',
    view: <AboutPage />,
  }),
})

export function AboutPage() {
  const siteStore = useSiteStore()

  return (
    <main>
      <Header slim />
      <Parallax
        pages={2}
        scrollingElement={window}
        container={bodyElement}
        pageHeight={siteStore.sectionHeight}
      >
        <LegsSection offset={0} />
        <FeetSection offset={1} />
      </Parallax>
    </main>
  )
}

AboutPage.theme = 'home'
