import '@o/nucleo'
import { Image } from '@o/ui'
import React from 'react'
import { IS_CHROME } from '../constants'
import { useSiteStore } from '../Layout'
import { Header } from '../views/Header'
import { Parallax } from '../views/Parallax'
import { SectionContent } from '../views/SectionContent'
import { EarlyAccessSection } from './HomePage/EarlyAccessBetaSection'
import { Footer } from './HomePage/FooterSection'
import { bottomSeparator } from './HomePage/SecuritySection'

export function BetaPage() {
  const siteStore = useSiteStore()

  return (
    <>
      <Header slim />
      <Parallax
        pages={1}
        scrollingElement={window}
        container={IS_CHROME ? document.documentElement : document.body}
        pageHeight={siteStore.sectionHeight}
        innerStyle={{
          overflow: 'visible',
        }}
      >
        <EarlyAccessSection
          outside={
            <Image
              position="absolute"
              bottom={-50}
              left={0}
              right={0}
              width="100%"
              src={bottomSeparator}
            />
          }
          offset={0}
        />
      </Parallax>
      <SectionContent position="relative" zIndex={-1} pad={[150, true, 100]}>
        <Footer />
      </SectionContent>
    </>
  )
}

BetaPage.theme = 'home'
