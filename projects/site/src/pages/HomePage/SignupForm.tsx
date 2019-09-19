import { View, ViewProps } from '@o/ui'
import React, { memo } from 'react'

import { Join } from './Join'
import { TitleTextSmallCaps } from './TitleTextSmallCaps'

export const SignupForm = memo((props: ViewProps) => {
  return (
    <View
      sm-width="100%"
      width="50%"
      maxWidth={600}
      minWidth={340}
      margin="auto"
      borderRadius={12}
      overflow="hidden"
      elevation={2}
      background={theme => theme.backgroundStrong}
      alignSelf="center"
      {...props}
    >
      <View padding="lg">
        <Join
          header={
            <>
              <TitleTextSmallCaps alpha={0.7}>Beta Signup</TitleTextSmallCaps>
            </>
          }
          space="md"
        />
      </View>
    </View>
  )
})
