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
    <Paragraph alpha={0.85} size={1.4} fontWeight={400} sizeLineHeight={1.4} {...props} />
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
                src={require('../../assets/search.jpg')}
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
            <IntroPara delayIndex={1} stagger={0} size={2.3} sizeLineHeight={1.2}>
              <strong style={{ color: '#e61277' }}>We're rethinking search</strong>
              &nbsp;to prove quality and community go together.
            </IntroPara>
            <IntroPara fontWeight="600" delayIndex={2} stagger={-0.5}>
              <span style={{ color: '#249be9' }}>
                Dish starts as an app to find local <em>restaurant</em> gems 💎
              </span>
              : a fun, list making community debating the best food in your city. Create{' '}
              <strong>playlists</strong>, vote and debate the best ones.
            </IntroPara>
            <IntroPara alpha={0.65} delayIndex={3} stagger={-1}>
              {wordsWithBrandMark(
                `In order to keep it fun and high quality, we're launching it with a coin. All the fun of the old web, with some ideas from the new one.`,
              )}
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
