import * as React from 'react'
import { OrbitListItem } from '../../../views/OrbitListItem'
import { Row, Col, Text } from '@mcro/ui'
import { view } from '@mcro/black'
import { HighlightText } from '../../../views/HighlightText'

export const GroupedSearchItem = ({ item, query, ...props }) => {
  const num = abbreviateNumber(item.count)
  return (
    <OrbitListItem
      direct
      padding={[9, 11]}
      {...props}
      appConfig={{ id: `${Math.random()}`, type: 'search', subType: 'group', title: item.title }}
      appType="search"
    >
      <Row flex={1}>
        <Circle style={{ fontSize: num.length > 2 ? 15 : 18 }}>{num}</Circle>
        <Col flex={1} overflow="hidden">
          <Text ellipse size={1.1} fontWeight={500} padding={[0, 0, 1]}>
            {item.title}
          </Text>
          <HighlightText whiteSpace="normal" ellipse flex={1} alpha={0.5}>
            {item.text}
          </HighlightText>
        </Col>
      </Row>
    </OrbitListItem>
  )
}

const Circle = view({
  width: 40,
  height: 40,
  margin: ['auto', 14, 'auto', 0],
  background: [100, 100, 100, 0.2],
  color: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 300,
  borderRadius: 100,
})

function abbreviateNumber(num: number, fixed = 0) {
  if (num === null) {
    return null
  } // terminate early
  if (num === 0) {
    return '0'
  } // terminate early
  fixed = !fixed || fixed < 0 ? 0 : fixed // number of decimal places to show
  let b = num.toPrecision(2).split('e') // get power
  let k = b.length === 1 ? 0 : Math.floor(Math.min(+b[1].slice(1), 14) / 3) // floor at decimals, ceiling at trillions
  let c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3)).toFixed(1 + fixed) // divide by power
  let d = +c < 0 ? c : Math.abs(c) // enforce -0 is 0
  let e = d + ['', 'k', 'm', 'b', 't'][k] // append power
  return e
}
