import { Button, Input, Message, Section, SegmentedRow, Space } from '@o/ui'
import React from 'react'

export default function SettingsAppAccount() {
  // const [user] = useActiveUser()

  return (
    <Section bordered title="My Account" sizePadding={2}>
      <Message>
        Orbit syncs your configuration including which spaces you are a member of, and your personal
        perferences, so you can use Orbit on different computers.
      </Message>

      <Space />

      <Section>
        <SegmentedRow size={1.5}>
          <Input type="email" flex={1} placeholder="address@example.com" />
          <Button alt="action">Send Login Link</Button>
        </SegmentedRow>
      </Section>
    </Section>
  )
}
