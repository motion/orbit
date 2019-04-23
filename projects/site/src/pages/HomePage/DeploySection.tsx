import { Col, FullScreen, Image, Row, Space, toColor, View } from '@o/ui'
import React from 'react'

import appScreenshot from '../../../public/images/app-screenshot.jpg'
import arrow from '../../../public/images/callout-arrow.svg'
import codeScreenshot from '../../../public/images/code-screenshot.jpg'
import background from '../../../public/images/orbits-bg.jpg'
import { FadeIn } from '../../views/FadeIn'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { ParagraphIntro } from '../../views/ParagraphIntro'
import { PillButton } from '../../views/PillButton'
import { Spotlight } from '../../views/Spotlight'
import { TitleText } from '../../views/TitleText'
import { SpacedPageContent } from './SpacedPageContent'

const Para = props => <Paragraph sizeLineHeight={1.15} size={1.2} alpha={0.65} {...props} />

export function ShoulderSection(props) {
  return (
    <Page {...props}>
      <Page.Content>
        <SpacedPageContent
          transform={{
            y: '-28%',
          }}
          header={
            <>
              <FadeIn delay={0}>
                <PillButton>Deploy</PillButton>
              </FadeIn>
              <Space size="sm" />
              <FadeIn delay={50}>
                <TitleText size="xxl">Private, serverless, easy.</TitleText>
              </FadeIn>
            </>
          }
        >
          <Row space={60} margin={[0, '-180%']}>
            <Col flex={2} alignItems="flex-end" justifyContent="center">
              <FadeIn delay={100}>
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
              </FadeIn>
            </Col>

            <Col space flex={2} minWidth={300} maxWidth={340}>
              <FadeIn delay={200}>
                <ParagraphIntro>
                  Orbit runs locally on your computer, but can sync data from any cloud integration.
                </ParagraphIntro>
              </FadeIn>

              <FadeIn delay={250}>
                <Para>
                  It's a lot like a web browser, but designed from the ground up to make building
                  rich collaborative apps as easy as possible. It does so with an app kit that
                  handles many hard things for you - from syncing data, to complex views, to
                  providing APIs to do realtime peer-to-peer with your team.
                </Para>
              </FadeIn>

              <FadeIn delay={300}>
                <Para>
                  Built on open standards like Typescript and React, it's your ultimate
                  intranet-in-a-box.
                </Para>
              </FadeIn>

              <FadeIn delay={350}>
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
                >
                  How Orbit gives users control.
                </Para>
              </FadeIn>
            </Col>

            <Col flex={2} alignItems="flex-start" justifyContent="center">
              <FadeIn delay={300}>
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
              </FadeIn>
            </Col>
          </Row>
        </SpacedPageContent>
      </Page.Content>

      <Page.Parallax speed={0.2} zIndex={-2}>
        <FullScreen
          transform={{
            y: '-35%',
          }}
        >
          <FullScreen
            className="orbits-bg"
            opacity={0.18}
            backgroundImage={`url(${background})`}
            backgroundSize="cover"
            backgroundPosition="center center"
            backgroundRepeat="no-repeat"
          />
          <Spotlight />
        </FullScreen>
      </Page.Parallax>
    </Page>
  )
}
