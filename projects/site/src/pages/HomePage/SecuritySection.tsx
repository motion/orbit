import { Col, Grid, Image, Space, Theme } from '@o/ui'
import React from 'react'
import bottomLightSeparator from '../../../public/images/bottom-sep.svg'
import lightSeparator from '../../../public/images/light-separator.svg'
import people from '../../../public/images/people.svg'
import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { TitleTextSub } from './DemoSection'
import { SpacedPageContent } from './SpacedPageContent'

export function WaistSection(props) {
  return (
    <Theme name="light">
      <Page {...props}>
        <Page.Content
          outside={
            <>
              <Image
                transform={{ scaleX: -1 }}
                position="absolute"
                top={-120}
                left={0}
                right={0}
                width="100%"
                src={lightSeparator}
              />

              <Image
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                width="100%"
                src={bottomLightSeparator}
              />
            </>
          }
        >
          <SpacedPageContent
            margin={[0, '10%']}
            header={
              <>
                <PillButton>Security</PillButton>
                <Space size="sm" />
                <TitleText size="lg" fontWeight={300} maxWidth={400}>
                  Tell Security they can firewall Orbit completely.
                </TitleText>
                <Space />
              </>
            }
          >
            <Grid space="15%" itemMinWidth={350}>
              <Col space="xl">
                <Pitch size={1.2}>
                  Orbit never sends a single bit of data outside your firewall.
                </Pitch>

                <Pitch>
                  For the first time you can trust a startup to power all of your internal tools --
                  from interfacing with sensitive internal databases to visualizing imporant
                  metrics.
                </Pitch>
              </Col>

              <Image src={people} />
            </Grid>
          </SpacedPageContent>
        </Page.Content>

        <Page.Background background={theme => theme.background} bottom={50} />
      </Page>
    </Theme>
  )
}

const Pitch = props => <TitleTextSub textAlign="left" size={1} {...props} />
