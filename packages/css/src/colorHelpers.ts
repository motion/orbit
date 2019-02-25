import { isColor, toColor } from './toColor'
import { Color } from './types'
import { GradientArg, LinearGradient } from './utils/LinearGradient'

export { GradientArg } from './LinearGradient'

export function linearGradient(...args: GradientArg[]) {
  return new LinearGradient(args)
}
