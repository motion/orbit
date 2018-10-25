import { view } from '@mcro/black'
import * as React from 'react'
import { Row, Col, Text, View } from '@mcro/ui'
import { OrbitIcon } from './OrbitIcon'
import { OrbitOrb } from '../pages/OrbitPage/orbitDocked/orbitSettings/OrbitOrb'

const RowItemFrame = view(Row, {
  padding: [3, 8],
  alignItems: 'center',
}).theme(({ theme, selected }) => ({
  background: selected ? theme.backgroundHover : 'transparent',
  '&:hover': {
    background: theme.backgroundHover,
  },
}))

const leftPad = 10

export const RowItem = ({
  orb = ['blue', 'red'],
  title = null,
  icon = null,
  after = null,
  subtitle = null,
  selected = false,
  ...props
}) => {
  return (
    <RowItemFrame padding={leftPad} selected={selected} {...props}>
      <OrbitOrb size={16} background={orb[0]} color={orb[1]} />
      <View width={10} />
      <Col flex={1}>
        <Text sizeLineHeight={0.8} size={1.15} fontWeight={600}>
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
