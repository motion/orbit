import { Col, Image, Row, Space } from '@o/ui'
import React from 'react'

import people from '../../assets/illustrations/undraw_server_down_s4lk.svg'
import { MediaSmallHidden } from '../../views/MediaView'
import { TitleText } from '../../views/TitleText'
import { SpacedPageContent } from './SpacedPageContent'
import { TitleTextSub } from './TitleTextSub'

export default function SecuritySection() {
  return (
    <SpacedPageContent
      padding={[0, '5%']}
      margin="auto"
      maxWidth={860}
      header={
        <>
          <TitleText textAlign="center" maxWidth={520} fontWeight={300} size="md">
            Completely on-device, open source & customizable.
          </TitleText>
        </>
      }
    >
      <Space size="xxxl" />
      <Row flex={1} space="xl">
        <Col flex={3} space="lg">
          <Pitch alpha={1} size="xxs">
            Orbit never sends single bit of data outside your firewall.
          </Pitch>

          <Pitch fontWeight={200} alpha={0.7} size={0.5} sizeLineHeight={1.3}>
            That's right, Orbit runs by default completely privately, on your device, with no cloud,
            no server, no worry.
          </Pitch>
          <Pitch fontWeight={200} alpha={0.7} size={0.5} sizeLineHeight={1.3}>
            And with a push to a Github repo there's no servers to setup, with complete control and
            privacy from the start.
          </Pitch>
        </Col>

        <MediaSmallHidden>
          <Col flex={2} padding={0}>
            <Image userSelect="none" width="100%" maxWidth={300} margin="auto" src={people} />
          </Col>
        </MediaSmallHidden>
      </Row>
    </SpacedPageContent>
  )
}

const Pitch = props => <TitleTextSub textAlign="left" size={1} {...props} />
