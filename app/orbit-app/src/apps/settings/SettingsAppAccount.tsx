import { AppProps } from '@o/kit'
import {
  Button,
  InputField,
  Row,
  Section,
  SegmentedRow,
  Theme,
  Title,
  VerticalSpace,
  View,
} from '@o/ui'
import * as React from 'react'
import { IntroText } from '../../views'

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
        <InputField label="Username" />
        <InputField label="Password" />

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
