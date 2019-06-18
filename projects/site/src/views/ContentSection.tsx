import { Col, ColProps, useTheme } from '@o/ui'
import React from 'react'

import { useScreenVal } from '../pages/HomePage/SpacedPageContent'

export const ContentSection = (props: ColProps) => {
  const theme = useTheme()
  return (
    <Col
      className="content-section"
      pad={['xxxl', useScreenVal('sm', 'xxl', 'xxxl')]}
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
