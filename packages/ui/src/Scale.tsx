import { isDefined } from '@o/utils'
import React from 'react'

import { createContextualProps } from './helpers/createContextualProps'

const scaleContext = {
  size: 1,
}

const { Reset, PassProps, Context, useProps } = createContextualProps(scaleContext)

// will nest scaling so you can propogate it
export const Scale = (props: typeof scaleContext & { children: any }) => {
  const scale = useScale()

  if (!isDefined(props.size)) {
    return props.children
  }

  return <PassProps size={scale * props.size}>{props.children}</PassProps>
}

export const ScaleReset = Reset

export const useScale = () => {
  const context = useProps()
  return context ? context.size : 1
}

export const ScaleContext = Context
