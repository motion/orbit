import { Col, ViewProps } from '@o/ui'
import React, { forwardRef } from 'react'

import { useScreenHeightVal, useScreenSize } from '../../hooks/useScreenSize'

export const SpacedPageContent = forwardRef(
  ({ header = null, children, ...props }: ViewProps & { header?: any }, ref) => {
    const width = useScreenSize()
    return (
      <Col
        ref={ref}
        width="100%"
        margin={width === 'small' ? 0 : ['auto', 0]}
        // minHeight="80vh"
        // maxHeight={900}
        space={useScreenHeightVal('xl', 'xxl')}
        {...props}
      >
        <div style={{ flex: 1 }} />
        <Col space="xl" alignItems="center">
          {header}
        </Col>
        {children}
        <div style={{ flex: 1 }} />
      </Col>
    )
  },
)

export const useScreenVal = (small: any, medium: any, large: any) => {
  const screen = useScreenSize()
  return screen === 'small' ? small : screen === 'medium' ? medium : large
}
