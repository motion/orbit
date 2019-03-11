import { Button, Input, Message, Section, SegmentedRow, Theme, Title, VerticalSpace } from '@o/ui'
import * as React from 'react'

export default function SettingsAppAccount() {
  // const [user] = useActiveUser()

  return (
    <Section sizePadding={2}>
      <Title>My Account</Title>

      <Message>
        Orbit syncs your configuration including which spaces you are a member of, and your personal
        perferences, so you can use Orbit on different computers.
      </Message>

      <VerticalSpace />

      <Section>
        <SegmentedRow size={1.5}>
          <Input type="email" flex={1} placeholder="address@example.com" />
          <Theme name="selected">
            <Button>Send Login Link</Button>
          </Theme>
        </SegmentedRow>
      </Section>
    </Section>
  )
}
