import { Col, FullScreen, Image, Row, Space } from '@o/ui'
import React from 'react'

import bottomLightSeparator from '../../../public/images/bottom-sep.svg'
import people from '../../../public/images/people.svg'
import { useScreenSize } from '../../hooks/useScreenSize'
import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { TitleTextSub } from './AllInOnePitchDemoSection'
import { LineSep } from './LineSep'
import { SpacedPageContent, useScreenVal } from './SpacedPageContent'

export const bottomSeparator = bottomLightSeparator

export default function WaistSection() {
  const screen = useScreenSize()
  return (
    <>
      <Page.Content
        outside={
          <>
            <FullScreen zIndex={-1} background={theme => theme.background} bottom={150} />
            <LineSep
              top="-17%"
              height={120}
              left={0}
              right={0}
              width="100%"
              minWidth={1200}
              bottom={20}
              transform={{ scaleX: -1 }}
              zIndex={1}
            />
            <Image
              position="absolute"
              bottom={0}
              height={290}
              left={0}
              right={0}
              width="100%"
              minWidth={1000}
              src={bottomSeparator}
            />
          </>
        }
      >
        <SpacedPageContent
          padding={[0, '5%']}
          margin="auto"
          maxWidth={860}
          transform={{
            y: '-6%',
          }}
          header={
            <>
              <PillButton>Security</PillButton>
              <Space size="sm" />
              <TitleText textAlign="center" size="lg" maxWidth={400}>
                Tell Security they can firewall Orbit completely.
              </TitleText>
              <Space />
            </>
          }
        >
          <Row space={useScreenVal(20, 'lg', 'xl')}>
            <Col flex={3} space="xl">
              <Pitch alpha={1} size="md">
                Orbit never sends single bit of data outside your firewall.
              </Pitch>

              <Pitch fontWeight={200} alpha={0.7} size="sm" sizeLineHeight={1.5}>
                Get incredibly powerful internal tools without setting up infrastructure or having
                to trust a startup with any of your data -- interface with sensitive internal
                databases with ease, Orbit gives you complete control.
              </Pitch>
            </Col>

            {screen !== 'small' && (
              <Col flex={1} padding={0}>
                <Image maxWidth={300} margin="auto" src={people} />
              </Col>
            )}
          </Row>
        </SpacedPageContent>
      </Page.Content>
    </>
  )
}

const Pitch = props => <TitleTextSub textAlign="left" size={1} {...props} />
