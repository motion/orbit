import { gloss } from '@mcro/gloss'
import { Col, Row, Text, View } from '@mcro/ui'
import * as React from 'react'
import { Icon } from './Icon'
import { OrbitOrb } from './OrbitOrb'

const RowItemFrame = gloss(Row, {
  padding: [4, 8],
  alignItems: 'center',
}).theme(({ selected, hover }, theme) => ({
  background: selected ? theme.backgroundHover : 'transparent',
  '&:hover': hover !== false && {
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
  titleProps = null,
  children = null,
  ...props
}) => {
  return (
    <RowItemFrame padding={leftPad} selected={selected} {...props}>
      <OrbitOrb size={16} colors={orb} />
      <View width={10} />
      <Col flex={1}>
        <Text sizeLineHeight={0.8} size={1.15} fontWeight={600} {...titleProps}>
          {title || children}
        </Text>
        {!!subtitle && (
          <Text sizeLineHeight={0.8} size={0.9} alpha={0.5}>
            20 people
          </Text>
        )}
      </Col>
      {after}
      {!!icon && <Icon name={icon} size={14} />}
    </RowItemFrame>
  )
}
