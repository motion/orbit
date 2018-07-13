import * as React from 'react'

// standardize forward ref to `forwardRef` prop

export const forwardRef = View => {
  return React.forwardRef((props, ref) => <View {...props} forwardRef={ref} />)
}
