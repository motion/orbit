import * as React from 'react'
import { view } from '@mcro/black'
import { Text, View } from '@mcro/ui'

// just the top titlebar:
export const TitleBar = ({ children, after, ...props }) => (
  <TitleBarContain {...props}>
    <TitleBarText>{children}</TitleBarText>
    {after}
  </TitleBarContain>
)

const TitleBarContain = view(View, {
  flex: 1,
  overflow: 'hidden',
  height: 27,
  maxWidth: '100%',
  position: 'relative',
  zIndex: 10,
  pointerEvents: 'none',
})

const TitleBarText = props => (
  <Text
    size={1}
    fontWeight={400}
    ellipse={1}
    margin={0}
    padding={[0, 20, 0, 43]}
    lineHeight="1.5rem"
    {...props}
  />
)
