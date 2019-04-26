import { Col, FullScreen, Image, Row, Space, toColor, View } from '@o/ui'
import React from 'react'

import appScreenshot from '../../../public/images/app-screenshot.jpg'
import arrow from '../../../public/images/callout-arrow.svg'
import codeScreenshot from '../../../public/images/code-screenshot.jpg'
import background from '../../../public/images/orbits-bg.jpg'
import { FadeChild, fadeLeftProps, fadeRightProps, useFadePage } from '../../views/FadeIn'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { ParagraphIntro } from '../../views/ParagraphIntro'
import { PillButton } from '../../views/PillButton'
import { Spotlight } from '../../views/Spotlight'
import { TitleText } from '../../views/TitleText'
import { SpacedPageContent } from './SpacedPageContent'

const Para = props => <Paragraph sizeLineHeight={1.1} size={1.2} alpha={0.8} {...props} />

export function ShoulderSection(props) {
  const Fade = useFadePage()
  return (
    <Fade.FadeProvide>
      <Page {...props}>
        <Page.Content ref={Fade.ref}>
          <SpacedPageContent
            transform={{
              y: '-11%',
            }}
            header={
              <>
                <FadeChild delay={0}>
                  <PillButton>Deploy</PillButton>
                </FadeChild>
                <Space size="sm" />
                <FadeChild delay={200}>
                  <TitleText textAlign="center" size="xxxl">
                    Synced without a server.
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
                  <ParagraphIntro>
                    It's time we had control over our platforms. Orbit is designed to power the next
                    generation of apps and give users complete control.
                  </ParagraphIntro>
                </FadeChild>

                <FadeChild delay={350}>
                  <Para>
                    Your team can use Orbit to make apps together fast, without having to trust all
                    your sensitive internal data to the cloud, or get locked into a proprietary
                    platform.
                  </Para>
                </FadeChild>

                <FadeChild delay={450}>
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
                    Two ways we've lost control, and why it matters.
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

        <Page.Parallax speed={0.2} zIndex={-2}>
          <FullScreen
            transform={{
              y: '-20%',
            }}
          >
            <FullScreen
              className="orbits-bg"
              opacity={0.125}
              backgroundImage={`url(${background})`}
              backgroundSize="cover"
              backgroundPosition="center center"
              backgroundRepeat="no-repeat"
            />
            <Spotlight />
          </FullScreen>
        </Page.Parallax>
      </Page>
    </Fade.FadeProvide>
  )
}
