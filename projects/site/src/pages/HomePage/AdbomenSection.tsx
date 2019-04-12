import { Grid, Icon, Image, Paragraph, Space, Theme, View } from '@o/ui'
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
                <PillButton>App Kit</PillButton>
                <Space size="sm" />
                <TitleText size="xxl">Batteries Included.</TitleText>
                <Space size="sm" />
                <TitleTextSub>
                  Creating, maintaining, and collaborating apps shouldn't be so hard. Orbit tackles
                  the hard problems of development, deployment and toolkit.
                </TitleTextSub>
              </>
            }
          >
            <Grid space itemMinWidth={200}>
              <SimpleSection title="Spaces to collaborate." index={1} icon="grid">
                lorem ipsum
              </SimpleSection>
              <SimpleSection title="Spaces to collaborate." index={1} icon="grid">
                lorem ipsum
              </SimpleSection>
              <SimpleSection title="Spaces to collaborate." index={1} icon="grid">
                lorem ipsum
              </SimpleSection>
              <SimpleSection title="Spaces to collaborate." index={1} icon="grid">
                lorem ipsum
              </SimpleSection>
            </Grid>
          </SpacedPageContent>
        </Page.Content>

        <Page.Background background={theme => theme.background} />
      </Page>
    </Theme>
  )
}

const SimpleSection = props => (
  <View background="#eee">
    <TitleText>{props.title}</TitleText>
    <Icon name={props.icon} />
    <Paragraph>{props.children}</Paragraph>
  </View>
)
