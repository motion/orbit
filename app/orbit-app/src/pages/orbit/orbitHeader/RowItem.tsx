import { view } from '@mcro/black'
import * as React from 'react'
import { View, Row, Col, Text } from '@mcro/ui'
import { OrbitIcon } from '../../../views/OrbitIcon'

const RowItemFrame = view(Row, {
  padding: [2, 8],
  alignItems: 'center',
}).theme(({ hover, theme }) => ({
  '&:hover':
    hover === false
      ? null
      : {
          background: theme.background,
        },
}))

const leftPad = 10

export const RowItem = ({
  orb = null,
  title = null,
  icon = null,
  after = null,
  subtitle = null,
  ...props
}) => {
  return (
    <RowItemFrame padding={subtitle ? leftPad : [2, leftPad]} {...props}>
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
      {after}
      {!!icon && <OrbitIcon name={icon} size={14} />}
    </RowItemFrame>
  )
}
