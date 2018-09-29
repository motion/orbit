import * as React from 'react'
import { view } from '@mcro/black'
import { OrbitIcon } from './OrbitIcon'
import { Text } from '@mcro/ui'

const sidePad = 16

const Item = view({
  flexFlow: 'row',
  padding: [0, sidePad],
  height: 36,
  alignItems: 'center',
  inactive: {
    opacity: 0.5,
    filter: 'grayscale(1)',
  },
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:active': {
    opacity: 0.8,
  },
}).theme(({ theme, active }) => ({
  background: (active && theme.highlightBackground) || 'transparent',
  color: (active && theme.highlightColor) || 'inherit',
  '&:hover': {
    background: (active && theme.highlightBackground) || theme.backgroundHover,
  },
}))

const ItemTitle = view(Text, {
  fontWeight: 700,
  justifyContent: 'center',
  fontSize: 14,
  alpha: 0.5,
  flex: 1,
})

export const SimpleItem = ({ after = null, icon = null, title, ...props }) => (
  <Item {...props}>
    {!!icon && (
      <>
        <OrbitIcon size={18} icon={icon} />
        <div style={{ width: 12 }} />
      </>
    )}
    <ItemTitle ellipse color="inherit">
      {title}
    </ItemTitle>
    {after}
  </Item>
)
