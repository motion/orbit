// @flow
import React from 'react'
import Text from './text'

export default props =>
  <Text
    tagName="placeholder"
    size={1.5}
    fontWeight={600}
    color={[0, 0, 0, 0.3]}
    style={{
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    {...props}
  />
