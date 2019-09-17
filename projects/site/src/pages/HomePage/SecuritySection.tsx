import { Col, Image, Row, Space } from '@o/ui'
import React from 'react'

import people from '../../assets/illustrations/undraw_server_down_s4lk.svg'
import { FadeInView, useFadePage } from '../../views/FadeInView'
import { MediaSmallHidden } from '../../views/MediaView'
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
        maxWidth={860}
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
                A platform for us.
              </TitleText>
            </FadeInView>
            <TitleText
              alpha={0.8}
              textAlign="center"
              maxWidth={520}
              fontWeight={300}
              sizeLineHeight={1.3}
              size="sm"
            >
              Completely on-device, open source &&nbsp;customizable.
            </TitleText>
          </>
        }
      >
        <Space size="xxxl" />
        <Row flex={1} space="xxxl">
          <Col flex={3} space="xl">
            <Pitch alpha={1} size="xxs">
              Orbit is a desktop app platform that wants to bring the balance of power back to us.
            </Pitch>

            <Pitch fontWeight={200} alpha={0.75} size={0.5} sizeLineHeight={1.2}>
              <strong>How?</strong> Orbit runs privately on your device, never sending a single bit
              of data outside your firewall. And it's completely open source. No cloud, no servers,
              no telemetry, no worry.
            </Pitch>
            <Pitch fontWeight={200} alpha={0.75} size={0.5} sizeLineHeight={1.2}>
              And with a single command you can deploy your intranet to an internal server or our
              private cloud with peace of mind.
            </Pitch>
          </Col>

          <MediaSmallHidden>
            <Col flex={2} padding={0}>
              <Image userSelect="none" width="100%" maxWidth={300} margin="auto" src={people} />
            </Col>
          </MediaSmallHidden>
        </Row>
      </SpacedPageContent>
    </Fade.FadeProvide>
  )
}

const Pitch = props => <TitleTextSub textAlign="left" size={1} {...props} />
