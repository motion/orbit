import { ColorLike } from '@o/color'
import { CSSPropertySetResolved } from '@o/css'
import { selectDefined } from '@o/utils'
import { GlossThemeProps, resolveValueSafe, ThemeFn } from 'gloss'

export type ElevatableProps = {
  /** Height of the shadow */
  elevation?: number
  /** Override the color of the elevation shadow */
  elevationShadowColor?: ColorLike
  /** Override the opacity of the elevation shadow */
  elevationShadowOpacity?: number
  boxShadow?: CSSPropertySetResolved['boxShadow']
  elevatedShadowY?: (elevation: number) => any
  elevatedShadowSpread?: (elevation: number) => any
  elevatedShadowColor?: (elevation: number) => any
  boxShadowOpacity?: number
}

const round = (x: number) => Math.round(x * 100) / 100
const smoother = (base: number, amt = 1) =>
  round((Math.log(Math.max(1, base + 0.2)) + 0.75) * amt * 2)

/**
 * Accounts for darkness of background by default, but you can ovverride in Theme
 */

const elevatedShadow = (props: GlossThemeProps<ElevatableProps>) => {
  const el = props.elevation
  return [
    // x
    0,
    // y
    props.elevatedShadowY ? props.elevatedShadowY(el) : smoother(el, 1),
    // spread
    props.elevatedShadowSpread ? props.elevatedShadowSpread(el) : smoother(el, 2.85),
    // color
    props.elevationShadowColor ||
      (props.elevatedShadowColor
        ? props.elevatedShadowColor(el)
        : [
            0,
            0,
            0,
            props.elevationShadowOpacity ??
              `calc(${round(0.015 * smoother((11 - Math.min(10, el)) * 0.2))} + ${
                selectDefined(resolveValueSafe(props.boxShadowOpacity), 0)})`,
          ]),
  ]
}

export const elevationTheme: ThemeFn<ElevatableProps> = props => {
  if (!props.elevation) return
  return {
    boxShadow: [elevatedShadow(props), ...(Array.isArray(props.boxShadow) ? props.boxShadow : [])],
  }
}
