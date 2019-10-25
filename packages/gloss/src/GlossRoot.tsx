import React, { useLayoutEffect } from 'react'

/**
 * Used for our specificity selectors!
 */
export const GlossRoot = (props: { children: any }) => {
  useLayoutEffect(() => {
    document.body.className += ` _g0 _g1 _g2 _g3 _g4 _g5`
  }, [])
  return props.children
}
