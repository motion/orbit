import { Col, ViewProps } from '@o/ui'
import React from 'react'

import { useScreenSize } from '../../hooks/useScreenSize'

export function SpacedPageContent({
  header = null,
  children,
  ...props
}: ViewProps & { header?: any }) {
  const screen = useScreenSize()
  return (
    <Col
      width="100%"
      margin={screen === 'small' ? 0 : ['auto', 0]}
      height="80vh"
      maxHeight={900}
      space="xl"
      {...props}
    >
      <div style={{ flex: 1 }} />
      <Col space="sm" alignItems="center" pad={useScreenVal(false, true, true)}>
        {header}
      </Col>
      {children}
      <div style={{ flex: 1 }} />
    </Col>
  )
}

export const useScreenVal = (small: any, medium: any, large: any) => {
  const screen = useScreenSize()
  return screen === 'small' ? small : screen === 'medium' ? medium : large
}
