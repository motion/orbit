import { Stack, StackProps, useTheme } from '@o/ui'
import React from 'react'

export const ContentSection = (props: StackProps) => {
  const theme = useTheme()
  return (
    <Stack
      className="content-section"
      padding={['md', '3%']}
      sm-padding={['md', 0]}
      // lg-padding={['md', 0]}
      width="100%"
      // maxWidth={760}
      fontSize={17}
      margin={[0, 'auto']}
      lineHeight={28}
      color={theme.color.setAlpha(0.85)}
      {...props}
    />
  )
}
