import { Col, Icon, Image, Row, SimpleText, Space, toColor, View } from '@o/ui'
import React from 'react'

import { fontProps } from '../../constants'
import appScreenshot from '../../public/images/app-screenshot.jpg'
import arrow from '../../public/images/callout-arrow.svg'
import codeScreenshot from '../../public/images/code-screenshot.jpg'
import { fadeAnimations, FadeInView, useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { Paragraph } from '../../views/Paragraph'
import { ParagraphIntro } from '../../views/ParagraphIntro'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { SpacedPageContent } from './SpacedPageContent'

const Para = props => <Paragraph sizeLineHeight={1.1} size={1.2} alpha={0.72} {...props} />

export default function DeploySection() {
  const Fade = useFadePage()
  return (
    <Fade.FadeProvide>
      <Page.BackgroundParallax
        speed={0.25}
        zIndex={-2}
        opacity={0.4}
        offset={-0.4}
        x="-30%"
        scale={2}
        background="radial-gradient(circle closest-side, #2F30C9, transparent)"
      />

      {/* big purple bottom left */}
      {/* <Page.BackgroundParallax
        speed={-0.45}
        zIndex={-1}
        opacity={0.22}
        offset={0.4}
        x="-40%"
        scale={2.7}
        background="radial-gradient(circle closest-side, #1AAFFF, transparent)"
      /> */}

      {/* dark red bottom right */}
      {/* <Page.BackgroundParallax
        speed={0.4}
        zIndex={-1}
        opacity={0.45}
        offset={1.1}
        x="55%"
        scale={2.2}
        background="radial-gradient(circle closest-side, #8B2028, transparent)"
      /> */}

      <SpacedPageContent
        padding={['4vh', 0, '8vh']}
        nodeRef={Fade.ref}
        header={
          <>
            <FadeInView delayIndex={0}>
              <PillButton>Develop</PillButton>
            </FadeInView>
            <FadeInView delayIndex={0}>
              <TitleText textAlign="center" size="lg">
                An all-in-one workspace
              </TitleText>
            </FadeInView>
          </>
        }
      >
        <Space size={60} />
        <Row space={60} sm-space={0} margin={[0, '-180%']} sm-margin="0">
          <Col sm-display="none" flex={2} alignItems="flex-end" justifyContent="center">
            <FadeInView {...fadeAnimations.left} delayIndex={2}>
              <View
                // speed={0.1}
                // offset={0}
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
            </FadeInView>
          </Col>

          <Col space="xxl" flex={2} minWidth={300} maxWidth={340}>
            <FadeInView delayIndex={1}>
              <ParagraphIntro {...fontProps.TitleFont} sizeLineHeight={1.1} size={1.75}>
                Orbit makes building apps as easy as a few lines of code.
              </ParagraphIntro>
            </FadeInView>

            <FadeInView delayIndex={2}>
              <Col space="md">
                <Item>No setup or configuration.</Item>
                <Item>Instant feedback with easy to see errors.</Item>
                <Item>Plug in data instantly.</Item>
                <Item>A uniquely comprehensive UI kit.</Item>
              </Col>
            </FadeInView>

            <FadeInView delayIndex={3}>
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
                Get started with Orbit.
              </Para>
            </FadeInView>
          </Col>

          <Col sm-display="none" flex={2} alignItems="flex-start" justifyContent="center">
            <FadeInView {...fadeAnimations.right} delayIndex={3}>
              <View
                // speed={-0.1}
                // offset={0.05}
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
            </FadeInView>
          </Col>
        </Row>
        <View flex={10} />
      </SpacedPageContent>
    </Fade.FadeProvide>
  )
}

const Item = props => (
  <Row space padding>
    <Icon name="tick" />
    <SimpleText flex={1} size="sm" alpha={0.75} {...props} />
  </Row>
)
