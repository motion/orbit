import FitText, { TextFitProps } from '@mcro/react-textfit'
import * as React from 'react'

export function TextFit(props: Partial<TextFitProps>) {
  return <FitText max={10000} mode="single" {...props} />
}
