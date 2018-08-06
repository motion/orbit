import * as React from 'react'

export const getNonReactElementProps = nextProps => {
  let props = {}
  for (const key of Object.keys(nextProps)) {
    if (React.isValidElement(nextProps[key])) {
      continue
    }
    props[key] = nextProps[key]
  }
  return props
}
