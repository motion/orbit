// @flow
import * as React from 'react'
import Text from './text'

export default (props: Object) =>
  <Text
    tagName="placeholder"
    size={1.5}
    fontWeight={600}
    color={[0, 0, 0, 0.3]}
    style={{
      margin: 'auto',
    }}
    {...props}
  />
