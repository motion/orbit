import { Col, SpaceGroup, View, ViewProps } from '@o/ui'
import React from 'react'

export function SpacedPageContent({ header, children, ...props }: ViewProps & { header: any }) {
  return (
    <View margin={['auto', 0]} height="80vh" maxHeight={900} {...props}>
      <SpaceGroup>
        <div style={{ flex: 1 }} />
        <Col space="md" alignItems="center" pad>
          {header}
        </Col>
        {children}
        <div style={{ flex: 1 }} />
      </SpaceGroup>
    </View>
  )
}
