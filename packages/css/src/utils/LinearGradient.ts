import { isColor, toColor } from '../toColor'
import { Color } from '../types'

export type GradientArg = string | Color

export class LinearGradient {
  items: GradientArg[]

  constructor(items: GradientArg[]) {
    this.items = items
  }

  getColors() {
    return this.items.filter(isColor)
  }

  toString() {
    const args = this.items.map(item => (isColor(item) ? toColor(item) : item)).join(', ')
    return `linear-gradient(${args})`
  }

  toCSS() {
    return this.toString()
  }
}
