import * as React from 'react'
import FitText, { TextFitProps } from '@mcro/react-textfit'

export const ViewPortText = (props: Partial<TextFitProps>) => {
  return <FitText max={10000} mode="single" {...props} />
}
