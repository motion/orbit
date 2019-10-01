import { Color, toColor } from '@o/color'
import { SimpleStyleObject, ThemeObject } from 'gloss'

import { colorize, darken, decreaseContrast, increaseContrast, largeAmount, opposite, roundToExtreme, smallAmount } from '.'

// generate some properly contrasted colors based on base colors
// insert theme into psuedo styles for Blur Active and ActiveHighlight
export const fromStyles = <A extends Partial<SimpleStyleObject>>(s: A): ThemeObject & A => {
  if (!s.background && !s.color) {
    throw new Error('Themes require at least background or color')
  }
  const backgroundColored = s.background
    ? toColor((s as any).background)
    : opposite(toColor((s as any).color!))
  // some handy basic styles
  const base = colorize({
    background: backgroundColored,
    color: s.color || roundToExtreme(decreaseContrast(opposite(backgroundColored), largeAmount)),
    borderColor: s.borderColor || increaseContrast(backgroundColored, smallAmount),
  }) as {
    background: Color
    color: Color
    borderColor: Color
  }
  const baseColor = toColor(base.color)
  const backgroundHover = base.background.lighten(base.background.isLight() ? 0.1 : 0.15)
  const res: ThemeObject = {
    ...colorize({
      // for buttons/surfaces, we generate a nice set of themes
      colorHover: s.colorHover || baseColor.lighten(0.1),
      backgroundHover: s.backgroundHover || backgroundHover,
      borderColorHover: s.borderColorHover || increaseContrast(base.borderColor, smallAmount),
      backgroundActiveHover:
        s.backgroundActiveHover || increaseContrast(base.background, largeAmount),
      backgroundActive: s.backgroundActive || decreaseContrast(base.background, largeAmount),
      borderColorActive: s.borderColorActive || decreaseContrast(base.borderColor, smallAmount),
      backgroundBlur: s.backgroundBlur || darken(base.background, largeAmount),
      colorBlur: s.colorBlur || darken(base.color, largeAmount),
      borderColorBlur: s.borderColorBlur || darken(base.borderColor, largeAmount),
      // focus is not desirable for many things...
      // backgroundFocus: s.backgroundFocus || decreaseContrast(base.background, largeAmount),
      // borderColorFocus: s.borderColorFocus || decreaseContrast(base.borderColor, largeAmount),
      // ensure rest is last so they can override anything
      backgroundDisabled: backgroundColored.desaturate(0.85).setAlpha(0.2),
      colorDisabled: baseColor.setAlpha(baseColor.getAlpha() * 0.25),
      ...s,
      // except for base which is already using the right order
      ...base,
    }),
  }
  return res as any
}
