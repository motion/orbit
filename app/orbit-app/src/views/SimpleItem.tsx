import { gloss } from '@o/gloss'
import { Icon } from '@o/kit'
import { Text } from '@o/ui'
import * as React from 'react'

const sidePad = 16

const Item = gloss({
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
}).theme(({ active }, theme) => ({
  background: (active && theme.highlightBackground) || 'transparent',
  color: (active && theme.highlightColor) || theme.color,
  '&:hover': {
    background: (active && theme.highlightBackground) || theme.backgroundHover,
  },
}))

const ItemTitle = gloss(Text, {
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
        <Icon size={18} icon={icon} />
        <div style={{ width: 12 }} />
      </>
    )}
    <ItemTitle ellipse color="inherit">
      {title}
    </ItemTitle>
    {after}
  </Item>
)
