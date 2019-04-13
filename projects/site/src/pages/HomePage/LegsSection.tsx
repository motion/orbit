import { Col, Grid, Image, Space, Theme } from '@o/ui'
import React from 'react'
import people from '../../../public/images/people.svg'
import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { TitleTextSub } from './NeckSection'
import { SpacedPageContent } from './SpacedPageContent'

export function LegsSection() {
  return (
    <Theme name="home">
      <Page offset={6}>
        <Page.Content>
          <SpacedPageContent
            header={
              <>
                <PillButton>Mission</PillButton>
                <Space size="sm" />
                <TitleText size="md">A better deal for apps.</TitleText>
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
