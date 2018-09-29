import * as React from 'react'
import { view } from '@mcro/black'
import { Text, Row } from '@mcro/ui'

// just the top titlebar:
export const TitleBar = ({ children = null, before = null, after = null, ...props }) => (
  <TitleBarContain {...props}>
    {before}
    <TitleBarText>{children}</TitleBarText>
    {after}
  </TitleBarContain>
)

const TitleBarContain = view(Row, {
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
    padding={[0, 10]}
    lineHeight="1.5rem"
    {...props}
  />
)
