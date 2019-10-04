import { ColorLike } from '@o/color'
import { CSSPropertySetResolved } from '@o/css'
import { CompiledTheme } from 'gloss'

import { weakKey } from '../helpers/weakKey'

export type ElevatableProps = {
  /** Height of the shadow */
  elevation?: number
  /** Override the color of the elevation shadow */
  elevationShadowColor?: ColorLike
  /** Override the opacity of the elevation shadow */
  elevationShadowOpacity?: number
  boxShadow?: CSSPropertySetResolved['boxShadow']
}

const round = (x: number) => Math.round(x * 100) / 100
const smoother = (base: number, amt = 1) =>
  round((Math.log(Math.max(1, base + 0.2)) + 0.75) * amt * 2)

/**
 * Accounts for darkness of background by default, but you can ovverride in Theme
 */
const elevatedShadow = (props: ElevatableProps, theme: CompiledTheme) => {
  const el = props.elevation
  return [
    // x
    0,
    // y
    theme.elevatedShadowY ? theme.elevatedShadowY(el) : smoother(el, 1),
    // spread
    theme.elevatedShadowSpread ? theme.elevatedShadowSpread(el) : smoother(el, 2.85),
    // color
    props.elevationShadowColor ||
      (theme.elevatedShadowColor
        ? theme.elevatedShadowColor(el)
        : [
            0,
            0,
            0,
            props.elevationShadowOpacity ||
              round(0.05 * smoother((11 - Math.min(10, el)) * 0.2)) +
                (theme.boxShadowOpacity ? theme.boxShadowOpacity.get() : 0),
          ]),
  ]
}

export const getElevation = (props: ElevatableProps, theme: CompiledTheme) => {
  return cacheReturn({
    keys: [JSON.stringify([props.elevation, props.boxShadow]), theme],
    value: () => {
      if (!props.elevation) {
        return {
          boxShadow: props.boxShadow,
        }
      }
      return {
        boxShadow: [
          elevatedShadow(props, theme),
          ...(Array.isArray(props.boxShadow) ? props.boxShadow : []),
        ],
      }
    },
  })
}

// this may be a bit stupid (leaks memory)
// im trying this because <Arrow /> via <Popover /> was showing huge render cost
// and getElevation was causing new props to return every render
const cache = {}
const cacheReturn = ({ keys, value }: { keys: any[]; value: Function }) => {
  const keyStr = keys.map(key => `${weakKey(key)}`).join('')
  if (cache[keyStr]) {
    return cache[keyStr]
  }
  cache[keyStr] = value()
  return cache[keyStr]
}
