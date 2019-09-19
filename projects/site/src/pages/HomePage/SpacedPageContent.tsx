import { Col, ColProps } from '@o/ui'
import React from 'react'

import { useScreenSize } from '../../hooks/useScreenSize'

export const SpacedPageContent = ({
  header = null,
  children,
  ...props
}: ColProps & { header?: any }) => {
  return (
    <Col width="100%" sm-margin={0} margin={['auto', 0]} space="lg" sm-space="md" {...props}>
      <div style={{ display: 'flex', flex: 1 }} />
      <Col space="xl" sm-space="md" alignItems="center">
        {header}
      </Col>
      {children}
      <div style={{ display: 'flex', flex: 1 }} />
    </Col>
  )
}

export const useScreenVal = (small: any, medium: any, large: any) => {
  const screen = useScreenSize()
  return screen === 'small' ? small : screen === 'medium' ? medium : large
}
