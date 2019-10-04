import { Button, Stack, Theme, View } from '@o/ui'
import { useState } from 'react'
import React from 'react'

export function TestCSSVariables() {
  const [theme, setTheme] = useState('light')
  return (
    <Theme name={theme}>
      <View padding="lg" flex={1} background={theme => theme.background}>
        <Stack space="lg">
          <Button size={2} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            Change theme
          </Button>
          {/* <Button coat="lightBlue">lightBlue</Button>
          <Button coat="flat">flat</Button>
          <Button coat="bordered">bordered</Button> */}
        </Stack>
      </View>
    </Theme>
  )
}
