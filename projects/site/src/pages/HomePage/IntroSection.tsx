import { Box, gloss, Image, Stack, View } from '@o/ui'
import React from 'react'

import { mediaQueries } from '../../constants'
import { FadeInView, useFadePage } from '../../views/FadeInView'
import { wordsWithBrandMark } from '../../views/IntroText'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { SectionContent } from '../../views/SectionContent'

const IntroPara = ({ delayIndex, stagger, ...props }) => (
  <FadeInView parallax delayIndex={delayIndex} stagger={stagger}>
    <Paragraph alpha={0.85} size={1.4} fontWeight={200} sizeLineHeight={1.4} {...props} />
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
        scale={3}
        background="radial-gradient(circle closest-side, #1D4B84, transparent)"
      />
      <Page.BackgroundParallax
        speed={-0.25}
        offset={0.45}
        x="-5%"
        zIndex={0}
        opacity={0.1}
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
                abovemd-marginLeft="-30%"
                abovemd-width="130%"
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
          <Stack space="xl" justifyContent="center">
            <IntroPara delayIndex={1} stagger={0} size={1.8}>
              <strong style={{ color: '#fff' }}>We're rethinking how we build and use apps</strong>
              &nbsp;with a powerful internal tool platform.
            </IntroPara>
            <IntroPara delayIndex={2} stagger={-0.5}>
              It's a powerful platform to build common apps for teams. With easy data plugins, a
              rich view kit, and a collaborative app-store.
            </IntroPara>
            <IntroPara delayIndex={3} stagger={-1}>
              {wordsWithBrandMark(`Think of it as Bootstrap, for internal apps.`)}
            </IntroPara>
          </Stack>
        </HalfGrid>
      </SectionContent>
    </Fade.FadeProvide>
  )
}

const HalfGrid = gloss(Box, {
  display: 'grid',
  columnGap: 50,

  [mediaQueries.abovemd]: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
  },
})
