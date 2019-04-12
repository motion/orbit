import { Col, Space, SpaceGroup, View } from '@o/ui'
import React from 'react'

export function SpacedPageContent({ header, children }: { header: any; children: any }) {
  return (
    <View margin={['auto', 0]} height="80vh" maxHeight={900}>
      <SpaceGroup>
        <Col space="md" alignItems="center" pad="xl">
          {header}
        </Col>
        <div style={{ flex: 1, minHeight: 20 }} />
        {children}
        <div style={{ flex: 2.5 }} />
        <Space size="xxl" />
        <Space size="xxl" />
      </SpaceGroup>
    </View>
  )
}
