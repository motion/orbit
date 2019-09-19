import { SimpleText, View, ViewProps } from '@o/ui'
import React, { memo } from 'react'

import { Join } from './Join'

export const SignupForm = memo((props: ViewProps) => {
  return (
    <View
      sm-width="100%"
      md-width="80%"
      width="50%"
      notmd-maxWidth={600}
      notmd-minWidth={340}
      margin="auto"
      borderRadius={14}
      overflow="hidden"
      elevation={1}
      background={theme => theme.backgroundStrong}
      alignSelf="center"
      {...props}
    >
      <View padding="lg">
        <Join
          header={
            <>
              <SimpleText
                textAlign="center"
                textTransform="uppercase"
                letterSpacing={1}
                alpha={0.6}
                size="xs"
              >
                Beta Signup
              </SimpleText>
            </>
          }
          space="md"
        />
      </View>
    </View>
  )
})
