import { View, ViewProps } from '@o/ui'
import React from 'react'

import { Join } from './Join'
import { Wavy } from './purpleWaveUrl'
import { TitleTextSmallCaps } from './TitleTextSmallCaps'
import { TitleTextSub } from './TitleTextSub'

export function SignupForm(props: ViewProps) {
  return (
    <View
      width="50%"
      maxWidth={600}
      minWidth={340}
      margin="auto"
      borderRadius={12}
      overflow="hidden"
      elevation={3}
      background={theme => theme.backgroundStrong}
      {...props}
    >
      <Wavy width="100%" height={16} />
      <View pad="lg">
        <Join
          header={
            <>
              <TitleTextSmallCaps alpha={1}>Beta Signup</TitleTextSmallCaps>
              <TitleTextSub size="xs">We're rolling out to teams now.</TitleTextSub>
            </>
          }
          space="md"
        />
      </View>

      <Wavy width="100%" height={16} />
    </View>
  )
}
