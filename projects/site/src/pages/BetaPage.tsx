import { Space } from '@o/ui'
import { mount, route } from 'navi'
import React from 'react'

import { bodyElement } from '../constants'
import { useSiteStore } from '../SiteStore'
import { Header } from '../views/Header'
import { Parallax } from '../views/Parallax'
import { SectionContent } from '../views/SectionContent'
import EarlyAccessSection from './HomePage/EarlyAccessBetaSection'
import { Footer } from './HomePage/FooterSection'

export default mount({
  '/': route({
    title: 'Beta',
    view: <BetaPage />,
  }),
})

export function BetaPage() {
  const siteStore = useSiteStore()

  return (
    <>
      <Header slim noBorder />
      <Parallax
        pages={1}
        scrollingElement={window}
        container={bodyElement}
        pageHeight={siteStore.sectionHeight}
        innerStyle={{
          overflow: 'visible',
        }}
      >
        <EarlyAccessSection offset={0} />
      </Parallax>
      <SectionContent minHeight={450} position="relative" zIndex={-1} padding={[100, 32]}>
        <Footer />
        <Space size="xl" />
      </SectionContent>
    </>
  )
}

BetaPage.theme = 'light'
