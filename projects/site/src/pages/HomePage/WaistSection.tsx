import { Col, Grid, Image, Space, Theme } from '@o/ui'
import React from 'react'
import bottomLightSeparator from '../../../public/images/bottom-sep.svg'
import lightSeparator from '../../../public/images/light-separator.svg'
import people from '../../../public/images/people.svg'
import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { TitleTextSub } from './NeckSection'
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
                top={-90}
                left={0}
                right={0}
                src={lightSeparator}
              />

              <Image
                position="absolute"
                bottom={-90}
                left={0}
                right={0}
                src={bottomLightSeparator}
              />
            </>
          }
        >
          <SpacedPageContent
            header={
              <>
                <PillButton>Security</PillButton>
                <Space size="sm" />
                <TitleText size="xxl" fontWeight={300}>
                  Tell Security they can firewall Orbit completely.
                </TitleText>
              </>
            }
          >
            <Grid space itemMinWidth={400}>
              <Col>
                <TitleTextSub size={2.6}>
                  Orbit never sends a single bit of data outside your firewall.
                </TitleTextSub>

                <TitleTextSub>
                  For the first time you can trust a startup to power all of your internal tools --
                  from interfacing with sensitive internal databases to visualizing imporant
                  metrics.
                </TitleTextSub>
              </Col>

              <Image src={people} />
            </Grid>
          </SpacedPageContent>
        </Page.Content>

        <Page.Background background={theme => theme.background} />
      </Page>
    </Theme>
  )
}
