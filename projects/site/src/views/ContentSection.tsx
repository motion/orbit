import { Col, ColProps, useTheme } from '@o/ui'
import React from 'react'

export const ContentSection = (props: ColProps) => {
  const theme = useTheme()
  return (
    <Col
      pad="xxxl"
      maxWidth={800}
      margin="auto"
      fontSize={18}
      lineHeight={32}
      color={theme.color.alpha(0.85)}
      {...props}
    />
  )
}
