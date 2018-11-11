import * as React from 'react'
import { OrbitListItem } from '../../../views/OrbitListItem'
import { Row, Col, Text } from '@mcro/ui'
import { view } from '@mcro/black'
import { HighlightText } from '../../../views/HighlightText'

export const GroupedSearchItem = ({ item, query, ...props }) => {
  console.log('got item', item, props)
  return (
    <OrbitListItem
      direct
      {...props}
      appConfig={{ id: `${Math.random()}`, type: 'search', subType: 'group', title: item.title }}
      appType="search"
    >
      <Row flex={1}>
        <Circle>{item.count}</Circle>
        <Col>
          <Text size={1.1} fontWeight={500} padding={[0, 0, 4]}>
            {item.title}
          </Text>
          <HighlightText whiteSpace="normal" ellipse alpha={0.5}>
            {item.text}
          </HighlightText>
        </Col>
      </Row>
    </OrbitListItem>
  )
}

const Circle = view({
  width: 42,
  height: 42,
  margin: ['auto', 14, 'auto', 0],
  background: [100, 100, 100, 0.2],
  color: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 300,
  fontSize: 20,
  borderRadius: 100,
})
