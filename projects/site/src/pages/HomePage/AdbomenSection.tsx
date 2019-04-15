import { Grid, Image, Space, Theme } from '@o/ui'
import React from 'react'
import lightSeparator from '../../../public/images/light-separator.svg'
import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { TitleTextSub } from './NeckSection'
import { SimpleSection } from './SimpleSection'
import { SpacedPageContent } from './SpacedPageContent'

export function AbdomenSection(props) {
  return (
    <Theme name="light">
      <Page {...props}>
        <Page.Content
          outside={
            <Image
              position="absolute"
              top={-80}
              left={0}
              right={0}
              width="100%"
              src={lightSeparator}
            />
          }
        >
          <SpacedPageContent
            header={
              <>
                <PillButton>Pricing</PillButton>
                <Space size="sm" />
                <TitleText size="xxl">Early Access.</TitleText>
                <TitleTextSub>
                  Orbit is in early beta. We're doing something a little different. To join the
                  early access group, signup for our Pro plan.
                </TitleTextSub>
              </>
            }
          >
            <Grid
              alignItems="start"
              space="15%"
              itemMinWidth={240}
              maxWidth={800}
              margin={[0, 'auto']}
            >
              <SimpleSection title="Spaces to collaborate.">lorem ipsum</SimpleSection>
              <SimpleSection title="Spaces to collaborate.">lorem ipsum</SimpleSection>
            </Grid>
          </SpacedPageContent>
        </Page.Content>

        <Page.Background background={theme => theme.background} />
      </Page>
    </Theme>
  )
}
