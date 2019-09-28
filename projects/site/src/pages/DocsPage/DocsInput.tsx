import { Button, Input, PassProps, Stack, SurfacePassProps } from '@o/ui'
import React from 'react'

export let Basic = (
  <Stack space>
    <Input
      type="email"
      name="email"
      placeholder="Hello world"
      onChange={e => console.log(e.target.value)}
    />
    <Input icon="search" />
  </Stack>
)

export let Sized = (
  <Input
    size={2}
    sizeRadius={3}
    sizePadding={2}
    borderWidth={2}
    icon="book"
    placeholder="Hello world"
    onChange={e => console.log(e.target.value)}
    after="hi"
  />
)

export let Grouped = (
  <Stack direction="horizontal" group>
    <Input placeholder="Hello world" onChange={e => console.log(e.target.value)} />
    <Button>Submit</Button>
  </Stack>
)

export let GroupedSized = (
  <Stack space>
    <Stack direction="horizontal" group>
      <PassProps size="xl">
        <Input placeholder="Hello world" />
        <Button>Submit</Button>
      </PassProps>
    </Stack>
    <SurfacePassProps size={1.5} sizeRadius={2}>
      <Stack direction="horizontal" group>
        <Button background="transparent" icon="search" />
        <Input placeholder="Hello world" />
        <Button>Submit</Button>
      </Stack>
    </SurfacePassProps>
  </Stack>
)
