import { Stack, Tab, Tabs, Title } from '@o/ui'
import React, { useState } from 'react'

export let Controlled = (
  <Tabs>
    <Tab id="0" label="First">
      <Title>Tab 1</Title>
    </Tab>
    <Tab id="1" label="Second">
      <Title>Tab 2</Title>
    </Tab>
    <Tab id="2" label="Third">
      <Title>Tab 3</Title>
    </Tab>
  </Tabs>
)

export let Uncontrolled = () => {
  const [active, setActive] = useState('0')
  return (
    <>
      <Tabs onActive={x => setActive(x || '')}>
        <Tab id="0" label="First" />
        <Tab id="1" label="Second" />
        <Tab id="3" label="Third" />
      </Tabs>
      <Stack>
        <Title>Active: ${active}</Title>
      </Stack>
    </>
  )
}
