import * as React from 'react'
import { OrbitListItem } from '../../views/OrbitListItem'
import { Row, Col, Text } from '@mcro/ui'
import { view } from '@mcro/black'
import { HighlightText } from '../../views/HighlightText'

export const GroupedSearchItem = ({ item, query, ...props }) => {
  return (
    <OrbitListItem direct {...props}>
      <Row>
        <Circle>12</Circle>
        <Col>
          <Text size={1.2} fontWeight={500} padding={[0, 0, 4]}>
            {item.title}
          </Text>
          <HighlightText size={1} alpha={0.5}>
            {item.body}
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
  background: '#999',
  color: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 300,
  fontSize: 20,
  borderRadius: 100,
})
