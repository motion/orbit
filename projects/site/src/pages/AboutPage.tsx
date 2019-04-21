import { mount, route } from 'navi'
import React from 'react'

import { IS_CHROME } from '../constants'
import { useSiteStore } from '../SiteStore'
import { Header } from '../views/Header'
import { Parallax } from '../views/Parallax'
import { FeetSection } from './HomePage/FooterSection'
import { LegsSection } from './HomePage/MissionMottoSection'

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
        container={IS_CHROME ? document.documentElement : document.body}
        pageHeight={siteStore.sectionHeight}
      >
        <LegsSection offset={0} />
        <FeetSection offset={1} />
      </Parallax>
    </main>
  )
}

AboutPage.theme = 'home'
