import { gloss, Row } from '@o/gloss'
import * as React from 'react'
import { Button, ButtonProps } from './buttons/Button'
import { Text } from './text/Text'

// TODO this is a weak view, needs thought

// just the top titlebar:
export const TitleBar = ({ children = null, before = null, after = null, ...props }) => (
  <TitleBarContain {...props}>
    {before}
    <TitleBarText>{children}</TitleBarText>
    {after}
  </TitleBarContain>
)

const TitleBarContain = gloss(Row, {
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

export const TitleBarButton = React.forwardRef((props: ButtonProps, ref) => {
  return (
    <Button
      ref={ref}
      size={0.9}
      sizeRadius={1}
      sizeFont={1.1}
      sizePadding={0.95}
      iconSize={11}
      {...props}
    />
  )
})

export const TitleBarSpace = () => <div style={{ width: 10 }} />
