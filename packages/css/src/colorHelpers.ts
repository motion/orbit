import { isColor, toColor } from './toColor';
import { Color } from './types';

export type GradientArg = string | Color | { color: string | Color, position?: string }

const makeColor = x => isColor(x) ? toColor(x) : x

export class LinearGradient {
  items: GradientArg[]

  constructor(items: GradientArg[]) {
    this.items = items
  }

  getColors() {
    return this.items.filter(isColor)
  }

  toString() {
    const args = this.items.map(item => {
      if (typeof item === 'string' || !item.color) {
        return makeColor(item)
      }
      if (item.color) {
        return `${makeColor(item.color)} ${item.position}`
      }
    })

    return `linear-gradient(${args.join(', ')})`
  }
}

export function linearGradient(...args: GradientArg[]) {
  return new LinearGradient(args)
}
