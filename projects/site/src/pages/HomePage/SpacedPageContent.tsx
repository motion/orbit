import { Col, SpaceGroup, View, ViewProps } from '@o/ui'
import React from 'react'
import { useScreenSize } from '../../hooks/useScreenSize'

export function SpacedPageContent({
  header = null,
  children,
  ...props
}: ViewProps & { header?: any }) {
  const screen = useScreenSize()
  return (
    <View
      width="100%"
      margin={screen === 'small' ? 0 : ['auto', 0]}
      height="80vh"
      maxHeight={900}
      {...props}
    >
      <SpaceGroup>
        <div style={{ flex: 1 }} />
        <Col space="sm" alignItems="center" pad>
          {header}
        </Col>
        {children}
        <div style={{ flex: 1 }} />
      </SpaceGroup>
    </View>
  )
}
