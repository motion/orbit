import { toColor } from './toColor'
import { Color } from './types'

export function linearGradient(top: Color, bottom: Color) {
  return `linear-gradient(${toColor(top)}, ${toColor(bottom)})`
}
