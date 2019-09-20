import { Col, gloss, Image } from '@o/ui'
import React from 'react'

import { mediaQueries } from '../../constants'
import { useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { SectionContent } from '../../views/SectionContent'

const allDelay = 2

const IntroPara = props => (
  <Paragraph alpha={0.85} size="lg" fontWeight={200} sizeLineHeight={1.5} {...props} />
)

export function IntroSection() {
  const Fade = useFadePage({
    threshold: 0,
  })

  return (
    <Fade.FadeProvide>
      <Page.BackgroundParallax
        speed={-0.35}
        offset={-0.9}
        x="-5%"
        zIndex={-1}
        opacity={0.55}
        scale={2.5}
        background="radial-gradient(circle closest-side, #1D4B84, transparent)"
      />
      <Page.BackgroundParallax
        speed={-0.25}
        offset={0.45}
        x="-5%"
        zIndex={0}
        opacity={0.05}
        scale={0.5}
        background="radial-gradient(circle closest-side, #FFF358, #FFF358 80%, transparent 85%, transparent)"
      />

      <SectionContent position="relative" padding={['5vh', 0, '10vh']} zIndex={10}>
        <HalfGrid>
          <Col>
            <Image
              display="block"
              src={require('../../public/images/screen1.jpeg')}
              width="100%"
              height="auto"
              maxWidth={1200}
              margin="auto"
              lg-marginLeft="-30%"
              lg-width="130%"
            />
          </Col>
          <Col space="xl">
            <IntroPara size="xl">
              <strong style={{ color: '#fff' }}>We're rethinking how operating systems work</strong>
              , starting by building a magical workspace where your unified data is explorable and
              moldable.
            </IntroPara>
            <IntroPara>
              Import, search, and use data within apps easily. Create new apps in minutes and then
              share your work with a press of a button.
            </IntroPara>
            <IntroPara>
              It's a new type of thing: an app platform that runs personally on your device, but is
              powerful enough to power incredibly rich tools.
            </IntroPara>
          </Col>
        </HalfGrid>
      </SectionContent>
    </Fade.FadeProvide>
  )
}

const HalfGrid = gloss(Col, {
  display: 'grid',
  columnGap: 50,

  [mediaQueries.notlg]: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
})
