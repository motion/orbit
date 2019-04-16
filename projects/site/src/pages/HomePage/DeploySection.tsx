import { Col, FullScreen, gloss, Image, Row, Space, View } from '@o/ui'
import React from 'react'
import appScreenshot from '../../../public/images/app-screenshot.jpg'
import arrow from '../../../public/images/callout-arrow.svg'
import codeScreenshot from '../../../public/images/code-screenshot.jpg'
import orbitsbg from '../../../public/images/orbits-bg.jpg'
import orbits from '../../../public/images/orbits.svg'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { ParagraphIntro } from '../../views/ParagraphIntro'
import { PillButton } from '../../views/PillButton'
import { Spotlight } from '../../views/Spotlight'
import { TitleText } from '../../views/TitleText'
import { SpacedPageContent } from './SpacedPageContent'

const Para = props => <Paragraph sizeLineHeight={1.15} size={1.1} alpha={0.65} {...props} />

export function ShoulderSection(props) {
  return (
    <Page {...props}>
      <Page.Content>
        <SpacedPageContent
          transform={{
            y: '-22%',
          }}
          header={
            <>
              <PillButton>Deploy</PillButton>
              <Space size="sm" />
              <TitleText size="lg">The worlds fastest idea-to-deploy.</TitleText>
            </>
          }
        >
          <Row space={60} margin={[0, '-120%']}>
            <Col flex={2} alignItems="flex-end" justifyContent="center">
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
            </Col>

            <Col space flex={2} minWidth={300} maxWidth={340}>
              <ParagraphIntro fontWeight={400}>
                Orbit runs locally on your computer, but can sync data from any cloud integration.
              </ParagraphIntro>

              <Para>
                It's a lot like a web browser, but designed to make building rich collaborative apps
                easy. It does that through an app kit that handles many hard things for you from
                syncing data into a database, to building complex views, to syncing data
                peer-to-peer within your team.
              </Para>

              <Para>
                Built on open standards like Typescript and React, it's the ultimate intranet system
                in a box.
              </Para>

              <Para
                tagName="a"
                color="#E368E7"
                fontWeight={600}
                textDecorationColor="#444"
                textDecoration="underline"
                display="inline-block"
              >
                It's a new take on apps that gives us more control.
              </Para>
            </Col>

            <Col flex={2} alignItems="flex-start" justifyContent="center">
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
            </Col>
          </Row>
        </SpacedPageContent>
      </Page.Content>

      <Page.Parallax overflow="hidden" speed={0.1} zIndex={-2}>
        <FullScreen
          className="orbits-bg"
          opacity={0.14}
          backgroundImage={`url(${orbitsbg})`}
          backgroundSize="cover"
          backgroundPosition="center center"
          backgroundRepeat="no-repeat"
        />
        <Spotlight />
      </Page.Parallax>

      <Page.Parallax speed={-0.1} zIndex={-2}>
        <FullScreen transform={{ y: '6%', scale: 0.8 }} transformOrigin="bottom center">
          <FullScreen
            top="auto"
            height="50%"
            className="orbits"
            backgroundImage={`url(${orbits})`}
            backgroundPosition="top center"
            backgroundRepeat="no-repeat"
          />
          <FadeDown top="auto" height="50%" />
        </FullScreen>
      </Page.Parallax>
    </Page>
  )
}

const FadeDown = gloss(FullScreen).theme((_, theme) => ({
  background: `linear-gradient(transparent, ${theme.background} 80%)`,
}))
