import { GlossPropertySet } from '@o/css'
import { ThemeFn } from 'gloss'

import { Sizes } from '../Space'
import { getSizableValue } from './getSizableValue'
import { SizesObject } from './types'

export type MarginProps = {
  margin?: Sizes | SizesObject | GlossPropertySet['margin']
}

export const marginTheme: ThemeFn<MarginProps> = props => {
  if (props.margin && props.margin !== 0) {
    return { margin: getSizableValue(props.margin) }
  }
}
