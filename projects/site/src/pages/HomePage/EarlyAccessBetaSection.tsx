import { Button, Form, Image, Input, Space, Theme, View } from '@o/ui'
import React from 'react'
import lightSeparator from '../../../public/images/light-separator.svg'
import { Page } from '../../views/Page'
import { PillButton } from '../../views/PillButton'
import { TitleText } from '../../views/TitleText'
import { TitleTextSub } from './AllInOnePitchDemoSection'
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
              width="100%"
              minWidth={1200}
              height={100}
              src={lightSeparator}
            />
          }
        >
          {/* offset header stripe */}
          <View height={20} />

          <View margin={['auto', 0]}>
            <SpacedPageContent
              header={
                <>
                  <PillButton>Beta</PillButton>
                  <Space size="sm" />
                  <TitleText size="xxl">Early Access.</TitleText>
                  <TitleTextSub>
                    Orbit is now in beta and working with teams to solve their internal tools
                    problems.
                  </TitleTextSub>
                  <TitleTextSub>Sign up here to get in queue.</TitleTextSub>
                </>
              }
            >
              <View width="50%" maxWidth={600} minWidth={360} margin="auto">
                <Form space>
                  <Input
                    placeholder="Email address..."
                    flex={0}
                    size={2}
                    sizeRadius={2}
                    sizePadding={2}
                  />

                  <Button alt="confirm" size={2} sizeRadius={2} margin={[0, '20%']}>
                    Signup
                  </Button>
                </Form>
              </View>
            </SpacedPageContent>
          </View>
        </Page.Content>

        <Page.Background background={theme => theme.background} top={80} />
      </Page>
    </Theme>
  )
}
