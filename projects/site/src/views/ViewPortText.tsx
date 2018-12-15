import * as React from 'react'
import FitText from 'react-textfit'

export const ViewPortText = (props: React.HTMLProps<HTMLParagraphElement>) => {
  return <FitText max={10000} mode="single" {...props} />
}
