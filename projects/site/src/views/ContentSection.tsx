import { Col, ColProps, useTheme } from '@o/ui'
import React from 'react'

export const ContentSection = (props: ColProps) => {
  const theme = useTheme()
  return (
    <Col
      className="content-section"
      padding={['xxxl', 'sm']}
      width="100%"
      maxWidth={760}
      margin="auto"
      fontSize={16}
      lineHeight={28}
      color={theme.color.alpha(0.85)}
      {...props}
    />
  )
}
