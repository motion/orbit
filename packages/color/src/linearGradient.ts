import { toColor } from './color'
import { isColorLike } from './isColor'
import { ColorLike } from './types'

const convertToColor = item => (isColorLike(item) ? toColor(item) : item)

export function linearGradient(...args: ColorLike[]) {
  return new LinearGradient(args)
}

export class LinearGradient {
  items: ColorLike[]

  constructor(items: ColorLike[]) {
    this.items = items
  }

  getColors() {
    return this.items.filter(isColorLike).map(convertToColor)
  }

  toString() {
    const args = this.items.map(convertToColor).join(', ')
    return `linear-gradient(${args})`
  }

  toCSS() {
    return this.toString()
  }

  adjust(cb: (items: ColorLike) => ColorLike) {
    const next = this.items.map(cb)
    return new LinearGradient(next)
  }

  darken(amt) {
    console.log('this.getColors()[1]', this.getColors()[1])
    return this.getColors()[1].darken(amt)
  }
}
