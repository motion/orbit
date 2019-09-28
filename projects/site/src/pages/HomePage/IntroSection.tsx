import { Col, gloss, Image, View } from '@o/ui'
import React from 'react'

import { mediaQueries } from '../../constants'
import { FadeInView, useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { SectionContent } from '../../views/SectionContent'

const IntroPara = ({ delayIndex, stagger, ...props }) => (
  <FadeInView parallax delayIndex={delayIndex} stagger={stagger}>
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
        opacity={0.3}
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
          <View belowmd-marginBottom={50}>
            <FadeInView parallax>
              <Image
                display="block"
                src={require('../../public/images/screen1.jpeg')}
                width="100%"
                abovemd-marginLeft="-20%"
                abovemd-width="120%"
                abovesm-marginLeft="-50%"
                abovesm-width="150%"
                height="auto"
                maxWidth={1200}
                margin="auto"
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
          </View>
          <Col space="xl" justifyContent="center">
            <IntroPara delayIndex={1} stagger={0} size={1.8}>
              <strong style={{ color: '#fff' }}>We're rethinking how we build apps for work</strong>
              &nbsp;with a fun, creative workspace where unified data is explorable and moldable.
            </IntroPara>
            <IntroPara delayIndex={2} stagger={-0.5}>
              It's a smart, fast heads up display that's always there. Create new apps in minutes,
              share them with a press of a button.
            </IntroPara>
            <IntroPara delayIndex={3} stagger={-1}>
              Powerful enough to run your business, easier to use than bootstrap.
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

  [mediaQueries.abovemd]: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
})
