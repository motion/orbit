import { Form, Image, Input, Space, Theme, View } from '@o/ui'
import React from 'react'
import lightSeparator from '../../../public/images/light-separator.svg'
import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { TitleTextSub } from './NeckSection'
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
                <PillButton>Beta</PillButton>
                <Space size="sm" />
                <TitleText size="xxl">Early Access.</TitleText>
                <TitleTextSub>
                  Orbit is now in beta. We're rolling out to small groups. If interested, sign up,
                  we're letting people in in the order they sign up.
                </TitleTextSub>
              </>
            }
          >
            <View height="50%" width="50%" maxWidth={600} minWidth={400} margin="auto">
              <Form>
                <Input flex={0} size={2} sizeRadius={2} />
              </Form>
            </View>
          </SpacedPageContent>
        </Page.Content>

        <Page.Background background={theme => theme.background} />
      </Page>
    </Theme>
  )
}
