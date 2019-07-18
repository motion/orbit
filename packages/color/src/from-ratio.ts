import { Color } from './color'
import { RGBA } from './interfaces'
import { convertToPercentage } from './util'

export interface RatioInput {
  r: number | string
  g: number | string
  b: number | string
  a?: number | string
}

/**
 * If input is an object, force 1 into "1.0" to handle ratios properly
 * String input requires "1.0" as input, so 1 will be treated as 1
 */
export function fromRatio(ratio: RatioInput, opts?: any) {
  const newColor: Partial<RGBA> = {
    r: convertToPercentage(ratio.r),
    g: convertToPercentage(ratio.g),
    b: convertToPercentage(ratio.b),
  }
  if (ratio.a !== undefined) {
    newColor.a = Number(ratio.a)
  }

  return new Color(newColor as RGBA, opts)
}

/** old random function */
export function legacyRandom() {
  return new Color({
    r: Math.random(),
    g: Math.random(),
    b: Math.random(),
  })
}
