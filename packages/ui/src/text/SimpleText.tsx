import { isDefined } from '@o/utils'
import { alphaColorTheme, Base, BaseProps, getTextSizeTheme, gloss, propsToStyles } from 'gloss'

import { Config } from '../helpers/configureUI'
import { useScale } from '../Scale'
import { getTextSize } from '../Sizes'
import { Size } from '../Space'

export type SimpleTextProps = Omit<BaseProps, 'size'> & {
  size?: Size
  ellipse?: boolean
  selectable?: boolean
}

export const SimpleText = gloss<SimpleTextProps>(Base, {
  display: 'inline-block',
  whiteSpace: 'normal',
  ellipse: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  selectable: {
    userSelect: 'text',
  },
  pointable: {
    cursor: 'pointer',
  },
}).theme(propsToStyles, alphaColorTheme, scaledTextSizeTheme)

SimpleText.defaultProps = {
  ...Config.defaultProps.text,
  applyPsuedoColors: 'only-if-defined',
}

export function scaledTextSizeTheme(props: any) {
  const scale = useScale()
  const size = isDefined(props.size) ? getTextSize(props.size) : undefined
  return getTextSizeTheme(props, { scale, size })
}
