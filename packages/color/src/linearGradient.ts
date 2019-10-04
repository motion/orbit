import { Color } from './color'
import { isColorLike } from './isColor'
import { ColorLike } from './types'

const convertToColor = item => (isColorLike(item) ? new Color(item) : item)

export function linearGradient(...args: ColorLike[]) {
  return new LinearGradient(args)
}

export class LinearGradient {
  items: ColorLike[]

  constructor(items: ColorLike[]) {
    this.items = items
  }

  cssVariableSafeKeys = ['cssVariable', 'setCSSVariable', 'getCSSValue']
  cssVariable = ''
  setCSSVariable(name: string) {
    this.cssVariable = name
  }

  getColors() {
    return this.items.filter(isColorLike).map(convertToColor)
  }

  getCSSValue() {
    return this.toString()
  }

  toString() {
    const args = this.items.map(convertToColor).join(', ')
    return `linear-gradient(${args})`
  }

  adjust(cb: (items: ColorLike) => ColorLike) {
    const next = this.items.map(cb)
    return new LinearGradient(next)
  }

  darken(amt: number) {
    return this.getColors()[1].darken(amt)
  }

  isDark() {
    return this.getColors()[1].isDark()
  }

  setAlpha(pct: number) {
    return new LinearGradient(this.getColors().map(x => x.setAlpha(pct)))
  }
}
