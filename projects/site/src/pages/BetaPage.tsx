import { Space, Theme } from '@o/ui'
import { mount, route } from 'navi'
import React from 'react'

import { Header } from '../Layout'
import { FadeChild, FadeParent } from '../views/FadeIn'
import { SectionContent } from '../views/SectionContent'
import { EarlyAccessContent } from './HomePage/EarlyAccessContent'
import { Footer } from './HomePage/Footer'
import { LineSep } from './HomePage/LineSep'

export default mount({
  '/': route({
    title: 'Beta',
    view: <BetaPage />,
  }),
})

export function BetaPage() {
  return (
    <FadeParent>
      <Theme name={BetaPage.theme}>
        <Header slim noBorder background="transparent" />
        <FadeChild fullscreen style={{ pointerEvents: 'none' }}>
          <LineSep opacity={0.2} noOverlay top={30} />
        </FadeChild>

        <FadeChild delay={200}>
          <EarlyAccessContent />
        </FadeChild>

        <FadeChild delay={400} fullscreen style={{ pointerEvents: 'none' }}>
          <LineSep opacity={0.2} noOverlay top="auto" bottom={20} transform={{ scaleX: -1 }} />
        </FadeChild>

        <FadeChild delay={600}>
          <SectionContent minHeight={450} position="relative" padding={[100, 32]}>
            <Footer />
            <Space size="xl" />
          </SectionContent>
        </FadeChild>
      </Theme>
    </FadeParent>
  )
}

BetaPage.theme = 'light'
