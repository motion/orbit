import * as React from 'react'
import SizedSurface from '../sizedSurface'
import Text from '../text'

export default ({ children, textProps, ...props }) => (
  <SizedSurface
    borderRadius
    sizeHeight
    sizePadding={1.5}
    justify="center"
    align="center"
    borderWidth={1}
    noElement
    noWrap
    background="transparent"
    tagName="label"
    {...props}
  >
    <Text
      style={{ justifyContent: 'center', alignItems: 'center' }}
      ellipse
      {...textProps}
    >
      {children === true ? ' ' : children}
    </Text>
  </SizedSurface>
)
