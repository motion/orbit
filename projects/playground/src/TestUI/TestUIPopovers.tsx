import { Button, Popover, Stack, View } from '@o/ui'
import * as React from 'react'

export function TestUIPopovers() {
  return (
    <Stack direction="horizontal" flex={1} overflow="hidden" height="100%">
      <View width={200} overflowY="auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
          <Stack
            direction="horizontal"
            padding={20}
            height={200}
            key={i}
            borderBottom={[1, 'grey']}
            alignItems="center"
          >
            <View flex={1}>hello</View>
            <Popover
              open={i === 3}
              towards="right"
              width={250}
              height={300}
              target={<View>***</View>}
              openOnClick
              closeOnClickAway
              background
              borderRadius={10}
              elevation={1}
            >
              <View width={100} height={200} background="red" />
            </Popover>
          </Stack>
        ))}
      </View>
      <Button size={2} tooltip="hi hello" tooltipProps={{ open: true }}>
        test
      </Button>

      <Stack direction="horizontal" position="absolute" right={0}>
        <Button tooltip="hi hello">1</Button>
      </Stack>
    </Stack>
  )
}
