import { Col, Image, Row, View } from '@o/ui'
import React from 'react'

import people from '../../assets/illustrations/undraw_server_down_s4lk.svg'
import { useScreenSize } from '../../hooks/useScreenSize'
import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { SpacedPageContent, useScreenVal } from './SpacedPageContent'
import { TitleTextSub } from './TitleTextSub'

export default function WaistSection() {
  const screen = useScreenSize()
  return (
    <>
      <Page.Content>
        <SpacedPageContent
          padding={[0, '5%']}
          margin="auto"
          maxWidth={860}
          header={
            <>
              <PillButton>Security</PillButton>
              <TitleText textAlign="center" maxWidth={400}>
                Tell Security they can firewall Orbit completely.
              </TitleText>
            </>
          }
        >
          <View flex={1} />
          <Row space={useScreenVal(20, 'xl', 'xxxl')}>
            <Col flex={3} space="lg">
              <Pitch alpha={1} size="md">
                Orbit never sends single bit of data outside your firewall.
              </Pitch>

              <Pitch fontWeight={200} alpha={0.7} size="xs" sizeLineHeight={1.3}>
                Get incredibly powerful internal tools without setting up infrastructure or having
                to trust a startup with any of your data -- interface with sensitive internal
                databases with ease, Orbit gives you complete control.
              </Pitch>
            </Col>

            {screen !== 'small' && (
              <Col flex={1} padding={0}>
                <Image userSelect="none" maxWidth={300} margin="auto" src={people} />
              </Col>
            )}
          </Row>
          <View flex={1} />
        </SpacedPageContent>
      </Page.Content>
    </>
  )
}

const Pitch = props => <TitleTextSub textAlign="left" size={1} {...props} />
