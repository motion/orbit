import { Col, Image, Row, View } from '@o/ui'
import React from 'react'

import people from '../../assets/illustrations/undraw_server_down_s4lk.svg'
import { MediaSmallHidden } from '../../views/MediaView'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { SpacedPageContent } from './SpacedPageContent'
import { TitleTextSub } from './TitleTextSub'

export default function WaistSection() {
  return (
    <SpacedPageContent
      padding={[0, '5%']}
      margin="auto"
      maxWidth={860}
      header={
        <>
          <PillButton>Security</PillButton>
          <TitleText textAlign="center" maxWidth={520}>
            Tell Security they can firewall Orbit completely
          </TitleText>
        </>
      }
    >
      <View flex={1} />
      <Row flex={1} space="xl">
        <Col flex={3} space="lg">
          <Pitch alpha={1} size="xxs">
            Unlike just about every other platform, Orbit never sends single bit of data outside
            your firewall.
          </Pitch>

          <Pitch fontWeight={200} alpha={0.7} size={0.5} sizeLineHeight={1.3}>
            Get incredibly powerful internal tools without setting up infrastructure or having to
            trust a startup with any of your data -- interface with sensitive internal databases
            with ease, Orbit gives you complete control.
          </Pitch>
        </Col>

        <MediaSmallHidden>
          <Col flex={2} padding={0}>
            <Image userSelect="none" width="100%" maxWidth={300} margin="auto" src={people} />
          </Col>
        </MediaSmallHidden>
      </Row>
      <View flex={1} />
    </SpacedPageContent>
  )
}

const Pitch = props => <TitleTextSub textAlign="left" size={1} {...props} />
