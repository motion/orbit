import { Button, Form, Image, Input, Space, Theme, View } from '@o/ui'
import React from 'react'
import lightSeparator from '../../../public/images/light-separator.svg'
import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { TitleTextSub } from './DemoSection'
import { SpacedPageContent } from './SpacedPageContent'

export function AbdomenSection(props) {
  return (
    <Theme name="light">
      <Page {...props}>
        <Page.Content
          outside={
            <Image
              position="absolute"
              top={0}
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
                  Orbit is now in beta. We're rolling out to small groups.
                  <br />
                  Sign up here to get in queue.
                </TitleTextSub>
              </>
            }
          >
            <View height="50%" width="50%" maxWidth={600} minWidth={400} margin="auto">
              <Form space>
                <Input flex={0} size={2} sizeRadius={2} />

                <Button alt="confirm" size={2} sizeRadius={2} margin={[0, '20%']}>
                  Signup
                </Button>
              </Form>
            </View>
          </SpacedPageContent>
        </Page.Content>

        <Page.Background background={theme => theme.background} top={80} />
      </Page>
    </Theme>
  )
}
