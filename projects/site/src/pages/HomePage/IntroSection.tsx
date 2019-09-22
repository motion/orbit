import { Col, gloss, Image } from '@o/ui'
import React from 'react'

import { mediaQueries } from '../../constants'
import { FadeInView, useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { SectionContent } from '../../views/SectionContent'

const IntroPara = ({ delayIndex, ...props }) => (
  <FadeInView delayIndex={delayIndex}>
    <Paragraph alpha={0.85} size={1.5} fontWeight={200} sizeLineHeight={1.4} {...props} />
  </FadeInView>
)

export default function IntroSection() {
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

      <SectionContent
        nodeRef={Fade.ref}
        position="relative"
        padding={['10vh', 0, '10vh']}
        zIndex={10}
      >
        <HalfGrid>
          {/* marginbottom is safari fix */}
          <Col sm-marginBottom={50}>
            <FadeInView>
              <Image
                display="block"
                src={require('../../public/images/screen1.jpeg')}
                width="100%"
                height="auto"
                maxWidth={1200}
                margin="auto"
                lg-marginLeft="-30%"
                lg-width="130%"
                borderRadius={20}
                boxShadow={[
                  {
                    spread: 5,
                    blur: 80,
                    color: '#000',
                    y: 20,
                  },
                ]}
              />
            </FadeInView>
          </Col>
          <Col space="xl" justifyContent="center">
            <IntroPara delayIndex={1} size={1.8}>
              <strong style={{ color: '#fff' }}>We're rethinking how we build apps for work</strong>
              &nbsp;with a fun, creative workspace where unified data is explorable and moldable.
            </IntroPara>
            <IntroPara delayIndex={2}>
              It's a new heads up display for your desktop. Create new apps in minutes, share your
              work with a press of a button.
            </IntroPara>
            <IntroPara delayIndex={3}>
              It's a new type of thing: an app platform you contro, powerful enough to run your
              business, but easier to use than bootstrap.
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
