import * as React from 'react'
import { view } from '@mcro/black'
import { OrbitIcon } from './OrbitIcon'
import { Text } from '@mcro/ui'

const sidePad = 16

const Item = view({
  flexFlow: 'row',
  padding: [0, sidePad],
  height: 40,
  alignItems: 'center',
  inactive: {
    opacity: 0.5,
    filter: 'grayscale(1)',
  },
  '&:last-child': {
    borderBottom: 'none',
  },
})
Item.theme = ({ theme }) => ({
  borderBottom: [1, theme.borderColor.alpha(0.3)],
  '&:hover': {
    background: theme.backgroundHover,
  },
})

const ItemTitle = view(Text, {
  fontWeight: 700,
  padding: [0, 12],
  justifyContent: 'center',
  fontSize: 14,
  alpha: 0.5,
  flex: 1,
})

export const SimpleItem = ({
  inactive = false,
  after = null,
  icon,
  title,
  ...props
}) => (
  <Item inactive={inactive} {...props}>
    <OrbitIcon size={18} icon={icon} />
    <ItemTitle>{title}</ItemTitle>
    {after}
  </Item>
)
