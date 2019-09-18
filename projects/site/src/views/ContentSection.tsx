import { ColProps, useTheme, View } from '@o/ui'
import React from 'react'

export const ContentSection = (props: ColProps) => {
  const theme = useTheme()
  return (
    <View
      className="content-section"
      padding={['md', '5%']}
      sm-padding={['md', 0]}
      width="100%"
      maxWidth={760}
      fontSize={17}
      margin={[0, 'auto']}
      lineHeight={28}
      color={theme.color.setAlpha(0.85)}
      {...props}
    />
  )
}
