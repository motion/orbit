import { Center, Sidebar, Stack, SubTitle } from '@o/ui'
import React from 'react'

export let Basic = (
  <Stack height={500}>
    <Sidebar>
      <Center onClick={() => console.warn('got click')}>
        <SubTitle>Hello World</SubTitle>
      </Center>
    </Sidebar>
  </Stack>
)
