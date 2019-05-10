import { gloss } from 'gloss'
import * as React from 'react'
import { Icon } from '../Icon'
import { View, ViewProps } from '../View/View'

const ClearClickableArea = gloss(View, {
  height: '100%',
  padding: 5,
  transition: 'all ease 450ms 100ms',
  opacity: 1,
  alignItems: 'center',
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
  transform: {
    y: 1,
  },
}).theme((_, theme) => ({
  background: theme.buttonBackground || theme.background.alpha(0.25),
  '&:hover': {
    background: theme.buttonBackgroundHover || theme.backgroundHover,
  },
}))

export const ClearButton = ({
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseEnter,
  onMouseLeave,
  children = <Icon name="cross" size={8} opacity={0.8} margin="auto" />,
  hidden = false,
  hoverStyle,
  activeStyle,
  margin,
  ...props
}: ViewProps) => (
  <ClearClickableArea
    {...{
      onClick,
      onMouseDown,
      onMouseUp,
      onMouseEnter,
      onMouseLeave,
      hoverStyle,
      activeStyle,
      margin,
    }}
    hidden={hidden}
  >
    <ClearFrame {...props}>{children}</ClearFrame>
  </ClearClickableArea>
)
