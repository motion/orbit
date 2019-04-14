import { Col, SpaceGroup, View } from '@o/ui'
import React from 'react'

export function SpacedPageContent({ header, children }: { header: any; children: any }) {
  return (
    <View margin={['auto', 0]} height="80vh" maxHeight={900}>
      <SpaceGroup>
        <div style={{ flex: 1 }} />
        <Col space="md" alignItems="center" pad="xl">
          {header}
        </Col>
        {children}
        <div style={{ flex: 1 }} />
      </SpaceGroup>
    </View>
  )
}
