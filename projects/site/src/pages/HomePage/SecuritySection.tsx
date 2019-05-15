import { Col, Image, Row } from '@o/ui'
import React from 'react'

import bottomLightSeparator from '../../../public/images/bottom-sep.svg'
import people from '../../../public/images/people.svg'
import { useScreenSize } from '../../hooks/useScreenSize'
import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { SpacedPageContent, useScreenVal } from './SpacedPageContent'
import { TitleTextSub } from './TitleTextSub'

export const bottomSeparator = bottomLightSeparator

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
          <Row space={useScreenVal(20, 'xl', 'xxxl')}>
            <Col flex={3} space="lg">
              <Pitch alpha={1} size="md">
                Orbit never sends single bit of data outside your firewall.
              </Pitch>

              <Pitch fontWeight={200} alpha={0.7} size="sm" sizeLineHeight={1.3}>
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
        </SpacedPageContent>
      </Page.Content>
    </>
  )
}

const Pitch = props => <TitleTextSub textAlign="left" size={1} {...props} />
