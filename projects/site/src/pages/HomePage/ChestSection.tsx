import { gloss, Space, View } from '@o/ui'
import React from 'react'
import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { TitleTextSub } from './NeckSection'
import { SpacedPageContent } from './SpacedPageContent'

export function ChestSection() {
  return (
    <Page offset={3}>
      <Page.Content>
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
          <View display="grid">
            <SimpleSection title="Spaces to collaborate." index={1} icon="grid">
              lorem ipsum
            </SimpleSection>
          </View>
        </SpacedPageContent>
      </Page.Content>

      <Page.Background background={theme => theme.background} />
    </Page>
  )
}

const SimpleSection = gloss({})
