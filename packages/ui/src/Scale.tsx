import { isDefined, selectDefined } from '@o/utils'
import React, { createContext, useContext } from 'react'

import { getSize } from './Sizes'
import { Size } from './Space'

export const ScaleContext = createContext(1)

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
  return <ScaleContext.Provider value={parentScale * size}>{props.children}</ScaleContext.Provider>
}

export const ScaleReset = ({ children }) => {
  return <ScaleContext.Provider value={1}>{children}</ScaleContext.Provider>
}

export const useScale = () => {
  return selectDefined(useContext(ScaleContext), 1)
}
