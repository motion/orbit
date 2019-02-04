import { color, gloss, View } from '@mcro/gloss'
import * as React from 'react'
import { Icon } from '../Icon'

const ClearClickableArea = gloss(View, {
  padding: 5,
  transition: 'all ease 450ms 100ms',
  opacity: 1,
  hidden: {
    pointerEvents: 'none',
    opacity: 0,
  },
})

const ClearFrame = gloss(View, {
  fontSize: 14,
  lineHeight: 13,
  fontWeight: 600,
  width: 18,
  height: 18,
  borderRadius: 999,
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'default',
}).theme((_, theme) => ({
  background:
    (theme.buttonBackground && color(theme.buttonBackground).alpha(0.25)) ||
    theme.background.alpha(0.25),
}))

export const ClearButton = ({
  onClick = null,
  onHover = null,
  onMouseDown = null,
  onMouseUp = null,
  onMouseEnter = null,
  onMouseLeave = null,
  children = <Icon name="simple-remove" size={8} opacity={0.8} margin="auto" />,
  hover = null,
  hidden = false,
  ...props
}) => (
  <ClearClickableArea
    {...{
      '&:hover': hover,
      onClick,
      onHover,
      onMouseDown,
      onMouseUp,
      onMouseEnter,
      onMouseLeave,
    }}
    hidden={hidden}
  >
    <ClearFrame {...props}>{children}</ClearFrame>
  </ClearClickableArea>
)
