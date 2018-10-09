import { view } from '@mcro/black'
import * as React from 'react'
import { View, Row, Col, Text } from '@mcro/ui'
import { OrbitIcon } from '../../../views/OrbitIcon'

const RowItemFrame = view(Row, {
  minHeight: 30,
  padding: [4, 8],
  alignItems: 'center',
  '&:hover': {
    background: '#f2f2f2',
  },
})

const leftPad = 10

export const RowItem = ({ orb = null, title = null, icon = null, subtitle = null, ...props }) => {
  return (
    <RowItemFrame padding={subtitle ? leftPad : [4, leftPad]} {...props}>
      {!!orb && (
        <View
          borderRadius={100}
          borderColor={orb}
          borderWidth={2}
          borderStyle="solid"
          marginRight={8}
          width={12}
          height={12}
        />
      )}
      <Col flex={1}>
        <Text sizeLineHeight={0.8} size={1} fontWeight={600}>
          {title}
        </Text>
        {!!subtitle && (
          <Text sizeLineHeight={0.8} size={0.9} alpha={0.5}>
            20 people
          </Text>
        )}
      </Col>
      {!!icon && <OrbitIcon name={icon} size={14} opacity={0.5} />}
    </RowItemFrame>
  )
}
