import FitText, { TextFitProps } from '@o/react-textfit'
import * as React from 'react'

export function TextFit(props: Partial<TextFitProps>) {
  return <FitText max={10000} mode="single" {...props} />
}
