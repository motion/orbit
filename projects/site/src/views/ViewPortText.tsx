import * as React from 'react'
import FitText from 'react-textfit'

type Props = React.HTMLProps<HTMLParagraphElement> & { compressor?: number }

export const ViewPortText = ({ compressor = 1, ...rest }: Props) => {
  return <FitText mode="single" {...rest} />
}
