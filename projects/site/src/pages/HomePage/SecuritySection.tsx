import { Col, Image, Row, Space } from '@o/ui'
import React from 'react'

import people from '../../assets/illustrations/undraw_server_down_s4lk.svg'
import { mediaStyles } from '../../constants'
import { fadeAnimations, FadeInView, useFadePage } from '../../views/FadeInView'
import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { SpacedPageContent } from './SpacedPageContent'
import { TitleTextSub } from './TitleTextSub'

export default function SecuritySection() {
  const Fade = useFadePage()
  return (
    <Fade.FadeProvide>
      <Page.BackgroundParallax
        speed={0.3}
        zIndex={-2}
        opacity={0.235}
        top="20%"
        x="-55%"
        scale={1.6}
        background="radial-gradient(circle closest-side, #681635, transparent)"
        parallaxAnimate={geometry => ({
          y: geometry.useParallax().transform(x => x + 300),
          x: geometry.useParallax().transform(x => -x),
        })}
      />

      <SpacedPageContent
        nodeRef={Fade.ref}
        padding={['10vh', '5%', '10vh']}
        margin="auto"
        header={
          <>
            <FadeInView delayIndex={0}>
              <PillButton>Trust</PillButton>
            </FadeInView>
            <FadeInView delayIndex={1}>
              <TitleText textAlign="center" size="xl">
                Open & secure
              </TitleText>
            </FadeInView>
            <FadeInView delayIndex={2} {...fadeAnimations.up}>
              <TitleTextSub>Completely on-device, open source &&nbsp;customizable.</TitleTextSub>
            </FadeInView>
          </>
        }
      >
        <Space size="xxxl" />
        <FadeInView delayIndex={3} {...fadeAnimations.up}>
          <Row flex={1} space="xxxl">
            <Col flex={3} space="xl">
              <Pitch alpha={1} size="lg">
                You're in control.
              </Pitch>

              <Pitch alpha={0.75} size="md">
                Orbit runs privately on your device, never sending a single bit of data outside your
                firewall. It's completely open source. No cloud, no servers, no telemetry, no worry.
              </Pitch>
            </Col>

            <Col flex={4} padding={0} {...mediaStyles.visibleWhen.abovesm}>
              <Image userSelect="none" width="100%" maxWidth={300} margin="auto" src={people} />
            </Col>
          </Row>
        </FadeInView>
      </SpacedPageContent>
    </Fade.FadeProvide>
  )
}

const Pitch = props => <TitleTextSub textAlign="left" sizeFont={1.2} {...props} />
