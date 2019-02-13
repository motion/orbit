import { Button, Row, SegmentedRow, Theme, View } from '@mcro/ui'
import * as React from 'react'
import { InputRow, IntroText, Title, VerticalSpace } from '../../views'
import { Section } from '../../views/Section'
import { AppProps } from '../AppTypes'

export default function SettingsAppAccount(_props: AppProps) {
  // const [user] = useActiveUser()

  return (
    <Section sizePadding={2}>
      <Title>My Account</Title>

      <IntroText>Set up an account to sync preferences, spaces, and basic configuration.</IntroText>

      <VerticalSpace />

      <SegmentedRow flex={1} stretch>
        <Button background="transparent" fontWeight={600}>
          Login
        </Button>
        <Button>Signup</Button>
      </SegmentedRow>

      <Section>
        <InputRow label="Username" />
        <InputRow label="Password" />

        <Row>
          <View flex={1} />
          <Theme name="selected">
            <Button>Login</Button>
          </Theme>
        </Row>
      </Section>
    </Section>
  )
}
