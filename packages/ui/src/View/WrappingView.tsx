import { gloss } from 'gloss'
import React from 'react'

import { Size } from '../Space'
import { ViewProps } from './types'
import { View } from './View'
import { wrappingSpaceTheme } from './wrappingSpaceTheme'

type WrappedProps = {
  flexWrap?: ViewProps['flexWrap']
  parentSpacing?: Size
}

export const WrappingView = gloss<WrappedProps, ViewProps>(View, {
  flexDirection: 'inherit',
  maxWidth: '100%',
  alignItems: 'inherit',
  justifyContent: 'inherit',
}).theme(wrappingSpaceTheme)

export const wrapWithWrappingView = (element: React.ReactNode, props: WrappedProps) => {
  if (props.flexWrap === 'wrap' && props.parentSpacing) {
    return (
      <WrappingView flexWrap={props.flexWrap} isWrapped parentSpacing={props.parentSpacing}>
        {element}
      </WrappingView>
    )
  }
  return element
}
