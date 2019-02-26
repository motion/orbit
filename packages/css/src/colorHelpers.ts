import { GradientArg, LinearGradient } from './utils/LinearGradient'

export { GradientArg } from './utils/LinearGradient'

export function linearGradient(...args: GradientArg[]) {
  return new LinearGradient(args)
}
