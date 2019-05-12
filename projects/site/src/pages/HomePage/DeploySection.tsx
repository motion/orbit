import { Col, FullScreen, Image, Row, toColor, View } from '@o/ui'
import React from 'react'

import appScreenshot from '../../../public/images/app-screenshot.jpg'
import arrow from '../../../public/images/callout-arrow.svg'
import codeScreenshot from '../../../public/images/code-screenshot.jpg'
import { FadeChild, fadeLeftProps, fadeRightProps, useFadePage } from '../../views/FadeIn'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { ParagraphIntro } from '../../views/ParagraphIntro'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { SpacedPageContent, useScreenVal } from './SpacedPageContent'

const Para = props => <Paragraph sizeLineHeight={1.1} size={1.2} alpha={0.72} {...props} />

export default function ShoulderSection() {
  const Fade = useFadePage()
  return (
    <Fade.FadeProvide>
      <Page.Parallax speed={0.95} zIndex={-1}>
        <FullScreen
          opacity={0.16}
          transform={{ y: '-30%', x: '25%', scale: 1.4 }}
          background="radial-gradient(circle closest-side, #4A00A8 20%, #4A00A8, transparent)"
        />
      </Page.Parallax>

      <Page.Parallax speed={0.5} zIndex={-1}>
        <FullScreen
          opacity={0.25}
          transform={{ y: '95%', x: '-40%', scale: 2 }}
          background="radial-gradient(circle closest-side, #235867 20%, transparent)"
        />
      </Page.Parallax>

      <Page.Parallax speed={-0.25} zIndex={-1}>
        <FullScreen
          opacity={0.35}
          transform={{ y: '80%', x: '55%', scale: 2.5 }}
          background="radial-gradient(circle closest-side, #441316, transparent)"
        />
      </Page.Parallax>

      <Page.Content ref={Fade.ref}>
        <SpacedPageContent
          transform={{
            y: useScreenVal(0, '-10%', '-10%'),
          }}
          header={
            <>
              <FadeChild delay={0}>
                <PillButton>Trust</PillButton>
              </FadeChild>
              <FadeChild delay={200}>
                <TitleText textAlign="center" size={useScreenVal('lg', 'xl', 'xxl')}>
                  Designed for privacy & control.
                </TitleText>
              </FadeChild>
            </>
          }
        >
          <Row space={60} margin={[0, '-180%']}>
            <Col flex={2} alignItems="flex-end" justifyContent="center">
              <FadeChild {...fadeLeftProps} delay={250}>
                <View
                  borderRadius={10}
                  elevation={3}
                  width={400}
                  height={350}
                  backgroundImage={`url(${appScreenshot})`}
                  backgroundSize="contain"
                  backgroundPosition="center center"
                  backgroundRepeat="no-repeat"
                  position="relative"
                >
                  <Image
                    position="absolute"
                    top={0}
                    right={-70}
                    zIndex={100}
                    src={arrow}
                    transform={{ scale: 0.6 }}
                  />
                </View>
              </FadeChild>
            </Col>

            <Col space flex={2} minWidth={300} maxWidth={340}>
              <FadeChild delay={200}>
                <ParagraphIntro size={1.7}>
                  From idea to deploy - you control the data, the code that runs it, and where it
                  runs.
                </ParagraphIntro>
              </FadeChild>

              <FadeChild delay={350}>
                <Para size={1.35} sizeLineHeight={1.25}>
                  It's time platforms didn't lock us in, create data silos, and work against our
                  interest.
                </Para>
              </FadeChild>

              <FadeChild delay={450}>
                <Para size={1.35} sizeLineHeight={1.25}>
                  Orbit is open source, decentralized, and gives you complete control over the data
                  it syncs. No proprietary platform. A truly reliable platform for apps.
                </Para>
              </FadeChild>

              <FadeChild delay={550}>
                <Para
                  tagName="a"
                  href="ok"
                  color="#E368E7"
                  transition="all ease 250ms"
                  hoverColor={toColor('#E368E7').lighten(0.1)}
                  fontWeight={500}
                  textDecorationColor="#444"
                  textDecoration="underline"
                  display="inline-block"
                  pointable
                  fontSize={16}
                >
                  Read how Orbit gives you control.
                </Para>
              </FadeChild>
            </Col>

            <Col flex={2} alignItems="flex-start" justifyContent="center">
              <FadeChild {...fadeRightProps} delay={400}>
                <View
                  borderRadius={10}
                  elevation={3}
                  width={400}
                  height={350}
                  backgroundImage={`url(${codeScreenshot})`}
                  backgroundSize="contain"
                  backgroundPosition="center center"
                  backgroundRepeat="no-repeat"
                  overflow="hidden"
                />
              </FadeChild>
            </Col>
          </Row>
        </SpacedPageContent>
      </Page.Content>
    </Fade.FadeProvide>
  )
}
