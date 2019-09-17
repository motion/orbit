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
        padding={['15vh', '5%']}
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
                The platform for us.
              </TitleText>
            </FadeInView>
            <TitleText
              alpha={0.8}
              textAlign="center"
              maxWidth={520}
              fontWeight={300}
              sizeLineHeight={1.3}
              size="md"
            >
              Completely on-device, open source & customizable.
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
              <strong>How?</strong> Orbit never sends a single bit of data outside your firewall.
              That's right, Orbit runs by default completely privately, on your device: no cloud, no
              servers, no worry.
            </Pitch>
            <Pitch fontWeight={200} alpha={0.75} size={0.5} sizeLineHeight={1.2}>
              And with a push to a Github repo there's no servers to setup, with complete control
              and privacy from the start.
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
