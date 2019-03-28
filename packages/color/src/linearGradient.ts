import { color, Color } from './color'
import { isColor, toColor } from './isColor'
import { ColorLike } from './types'

export function linearGradient(...args: ColorLike[]) {
  return new LinearGradient(args)
}

export class LinearGradient {
  items: Color[]

  constructor(items: ColorLike[]) {
    this.items = items.map(color)
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

  adjust(cb: (items: Color) => ColorLike) {
    const next = this.items.map(cb)
    return new LinearGradient(next)
  }
}
