import { isDefined } from '@o/utils'
import React from 'react'

import { createContextualProps } from './helpers/createContextualProps'
import { getSize } from './Sizes'
import { Size } from './Space'

const scaleContext = {
  size: 1,
}

const { Reset, PassProps, Context, useProps } = createContextualProps(scaleContext)

export type ScaleProps = {
  size?: Size
  children: any
}

// will nest scaling so you can propogate it
export const Scale = (props: ScaleProps) => {
  const parentScale = useScale()
  if (!isDefined(props.size)) {
    return props.children
  }
  const size = getSize(props.size)
  return <PassProps size={parentScale * size}>{props.children}</PassProps>
}

export const ScaleReset = Reset

export const useScale = () => {
  const context = useProps()
  return context ? context.size : 1
}

export const ScaleContext = Context
