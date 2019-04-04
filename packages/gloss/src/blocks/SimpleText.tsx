import { CSSPropertySetStrict } from '@o/css'
import { gloss } from '../gloss'
import { alphaColor, AlphaColorProps } from '../helpers/alphaColor'
import { propsToTextSize, TextSizeProps } from '../helpers/propsToTextSize'

const ellipseStyle = {
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

export type SimpleTextProps = AlphaColorProps &
  TextSizeProps &
  CSSPropertySetStrict & {
    ellipse?: boolean
    children?: any
  }

export const SimpleText = gloss<SimpleTextProps>({
  cursor: 'text',
  display: 'inline-block',
  whiteSpace: 'normal',
}).theme((props: any, theme) => {
  const textProps = propsToTextSize(props)
  const color = props.color || theme.color
  return {
    ...props,
    ...(props.ellipse && ellipseStyle),
    ...textProps,
    ...alphaColor({ color }, props),
  }
})
