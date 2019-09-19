import { Col, Image, Row, Space } from '@o/ui'
import React from 'react'

import people from '../../assets/illustrations/undraw_server_down_s4lk.svg'
import { mediaStyles } from '../../constants'
import { FadeInView, useFadePage } from '../../views/FadeInView'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { SpacedPageContent } from './SpacedPageContent'
import { TitleTextSub } from './TitleTextSub'

export default function SecuritySection() {
  const Fade = useFadePage()
  return (
    <Fade.FadeProvide>
      <SpacedPageContent
        nodeRef={Fade.ref}
        padding={['18vh', '5%']}
        margin="auto"
        header={
          <>
            <FadeInView delayIndex={0}>
              <PillButton>Trust</PillButton>
            </FadeInView>
            <FadeInView delayIndex={1}>
              <TitleText
                textAlign="center"
                size="xxl"
                // TODO
                // sm-size="lg"
              >
                Open & Secure
              </TitleText>
            </FadeInView>
            <TitleTextSub>Completely on-device, open source &&nbsp;customizable.</TitleTextSub>
          </>
        }
      >
        <Space size="xxxl" />
        <Row flex={1} space="xxxl">
          <Col flex={3} space="xl">
            <Pitch alpha={1} size="lg">
              The desktop app platform that brings power back to the user.
            </Pitch>

            <Pitch alpha={0.75} size="sm">
              <strong>How?</strong> Orbit runs privately on your device, never sending a single bit
              of data outside your firewall. And it's completely open source. No cloud, no servers,
              no telemetry, no worry.
            </Pitch>
            <Pitch alpha={0.75} size="sm">
              And with a single command you can deploy your intranet to an internal server or our
              private cloud with peace of mind.
            </Pitch>
          </Col>

          <Col flex={4} padding={0} {...mediaStyles.visibleWhen.notsm}>
            <Image userSelect="none" width="100%" maxWidth={300} margin="auto" src={people} />
          </Col>
        </Row>
      </SpacedPageContent>
    </Fade.FadeProvide>
  )
}

const Pitch = props => <TitleTextSub textAlign="left" sizeFont={1.2} {...props} />
