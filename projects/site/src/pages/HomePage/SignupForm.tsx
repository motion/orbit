import { View, ViewProps } from '@o/ui'
import React, { memo } from 'react'

import { Join } from './Join'
import { TitleTextSmallCaps } from './TitleTextSmallCaps'
import { useScreenVal } from './SpacedPageContent'

export const SignupForm = memo((props: ViewProps) => {
  return (
    <View
      width={useScreenVal('100%', '50%', '50%')}
      maxWidth={600}
      minWidth={340}
      margin="auto"
      borderRadius={12}
      overflow="hidden"
      elevation={4}
      background={theme => theme.backgroundStrong}
      alignSelf="center"
      {...props}
    >
      <View pad="lg">
        <Join
          header={
            <>
              <TitleTextSmallCaps alpha={1}>Beta Signup</TitleTextSmallCaps>
            </>
          }
          space="md"
        />
      </View>
    </View>
  )
})
