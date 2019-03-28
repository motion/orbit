import { Color } from '@o/color'

export type ThemeObject = {
  alternates?: {
    [key: string]: Partial<ThemeObject>
  }
  background: Color
  color: Color
  borderColor?: Color
  backgroundBlur?: Color
  colorBlur?: Color
  borderColorBlur?: Color
  backgroundHover?: Color
  colorHover?: Color
  borderColorHover?: Color
  backgroundFocus?: Color
  colorFocus?: Color
  borderColorFocus?: Color
  backgroundActive?: Color
  colorActive?: Color
  borderColorActive?: Color
  backgroundActiveHighlight?: Color
  colorActiveHighlight?: Color
  borderColorActiveHighlight?: Color
  [key: string]: any
}
