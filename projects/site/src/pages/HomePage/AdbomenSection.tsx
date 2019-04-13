import { Col, Grid, Image, Paragraph, Space, Theme } from '@o/ui'
import React from 'react'
import lightSeparator from '../../../public/images/light-separator.svg'
import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { TitleTextSub } from './NeckSection'
import { SpacedPageContent } from './SpacedPageContent'

export function AbdomenSection() {
  return (
    <Theme name="light">
      <Page offset={4}>
        <Page.Content>
          <Image position="absolute" top={-90} left={0} right={0} src={lightSeparator} />

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
            <Grid space itemMinWidth={200}>
              <PriceSection title="Spaces to collaborate.">lorem ipsum</PriceSection>
              <PriceSection title="Spaces to collaborate.">lorem ipsum</PriceSection>
            </Grid>
          </SpacedPageContent>
        </Page.Content>

        <Page.Background background={theme => theme.background} />
      </Page>
    </Theme>
  )
}

const PriceSection = props => (
  <Col background="#eee" space pad>
    <TitleText>{props.title}</TitleText>
    <Paragraph>{props.children}</Paragraph>
  </Col>
)
