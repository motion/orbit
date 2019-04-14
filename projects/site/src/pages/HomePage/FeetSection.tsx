import { Col, Grid, Space, Theme } from '@o/ui'
import React from 'react'
import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { TitleTextSub } from './NeckSection'
import { SpacedPageContent } from './SpacedPageContent'

export function FeetSection(props) {
  return (
    <Theme name="home">
      <Page {...props}>
        <Page.Content>
          <SpacedPageContent
            header={
              <>
                <PillButton>About</PillButton>
                <Space size="sm" />
                <TitleText size="xl">A better deal for apps.</TitleText>
              </>
            }
          >
            <Grid space itemMinWidth={400}>
              <Col space="lg">
                <TitleTextSub alpha={1} size={2.6}>
                  The web and app platforms are broken. Lets make apps easy to build, user friendly,
                  portable and collaborative.
                </TitleTextSub>
              </Col>
            </Grid>
          </SpacedPageContent>
        </Page.Content>

        <Page.Background background="darkblue" />
      </Page>
    </Theme>
  )
}
