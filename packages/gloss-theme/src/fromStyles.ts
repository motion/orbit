import { Color, LinearGradient, toColor } from '@o/color'
import { ThemeObject } from 'gloss'
import { isPlainObj } from 'gloss/_/helpers/helpers'

import { colorize, darken, decreaseContrast, increaseContrast, largeAmount, opposite, roundToExtreme, smallAmount } from '.'

// generate some properly contrasted colors based on base colors
// insert theme into psuedo styles for Blur Active and ActiveHighlight
export const fromStyles = <A extends Partial<{ [key: string]: any }>>(
  original: A,
  parent?: ThemeObject
): ThemeObject & A => {
  const color = original.color || parent?.color
  const background = original.background || parent?.background

  if (!background && !color) {
    throw new Error('Themes require at least background or color')
  }

  let backgroundColored = background
  if (background instanceof LinearGradient) {
    backgroundColored = background.getColors()[0]
  } else {
    backgroundColored = background ? toColor(background) : opposite(toColor(color))
  }
  // some handy basic styles
  const base = colorize({
    background: backgroundColored,
    color: color || roundToExtreme(decreaseContrast(opposite(backgroundColored), largeAmount)),
    borderColor: original.borderColor || increaseContrast(backgroundColored, smallAmount),
  }) as {
    // TODO bad typing
    background: Color
    color: Color
    borderColor: Color
  }

  const baseColor = toColor(base.color)
  const backgroundHover = base.background.lighten(base.background.isLight() ? 0.1 : 0.15)

  const res: ThemeObject = colorize({
    // for buttons/surfaces, we generate a nice set of themes
    colorHover: original.colorHover || baseColor.lighten(0.1),
    backgroundHover: original.backgroundHover || backgroundHover,
    borderColorHover: original.borderColorHover || increaseContrast(base.borderColor, smallAmount),
    backgroundActiveHover:
      original.backgroundActiveHover || increaseContrast(base.background, largeAmount),
    backgroundActive: original.backgroundActive || decreaseContrast(base.background, largeAmount),
    borderColorActive:
      original.borderColorActive || decreaseContrast(base.borderColor, smallAmount),
    backgroundBlur: original.backgroundBlur || darken(base.background, largeAmount),
    colorBlur: original.colorBlur || darken(base.color, largeAmount),
    borderColorBlur: original.borderColorBlur || darken(base.borderColor, largeAmount),
    // focus is not desirable for many things...
    // backgroundFocus: s.backgroundFocus || decreaseContrast(base.background, largeAmount),
    // borderColorFocus: s.borderColorFocus || decreaseContrast(base.borderColor, largeAmount),
    // ensure rest is last so they can override anything
    backgroundDisabled: backgroundColored.desaturate(0.85).setAlpha(0.2),
    colorDisabled: baseColor.setAlpha(baseColor.getAlpha() * 0.25),
    // except for base which is already using the right order
    ...base,
  })

  // recurse and apply fromStyles to sub themes
  for (const key in original) {
    if (res[key]) continue
    if (isPlainObj(original[key])) {
      res[key] = fromStyles(original[key], res)
      continue
    }
    res[key] = original[key]
  }

  return res as any
}
