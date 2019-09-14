import { Space, Theme, View } from '@o/ui'
import { mount, route } from 'navi'
import React from 'react'

import { Header } from '../Header'
import { FadeInView, FadeParent } from '../views/FadeInView'
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

        <Space size="xxl" />

        <View position="relative">
          <FadeInView minHeight={800} delay={200}>
            <EarlyAccessContent theme={BetaPage.theme} />
          </FadeInView>

          <FadeInView delay={400} fullscreen style={{ pointerEvents: 'none' }}>
            <LineSep opacity={0.2} noOverlay top="auto" bottom={-70} transform={{ scaleX: -1 }} />
          </FadeInView>
        </View>

        <FadeInView delay={600}>
          <SectionContent minHeight={450} position="relative" padding={[100, 32]}>
            <Footer />
            <Space size="xl" />
          </SectionContent>
        </FadeInView>
      </Theme>
    </FadeParent>
  )
}

BetaPage.theme = 'light'
