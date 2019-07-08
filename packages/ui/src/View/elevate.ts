import { CSSPropertySetResolved, ThemeObject } from '@o/css'

import { weakKey } from '../helpers/weakKey'

export type ElevatableProps = {
  elevation?: number
  boxShadow?: CSSPropertySetResolved['boxShadow']
}

const round = (x: number) => Math.round(x * 30) / 30
const smoother = (base: number, amt = 1) =>
  round((Math.log(Math.max(1, base + 0.2)) + 0.75) * amt * 2)

/**
 * Accounts for darkness of background by default, but you can ovverride in Theme
 */
const elevatedShadow = (x: number, theme: ThemeObject) => {
  if (!theme.background.isDark) debugger
  const darkTheme = theme.background.isDark()
  return [
    // x
    0,
    // y
    theme.elevatedShadowY ? theme.elevatedShadowY(x) : smoother(x, 1) * (darkTheme ? 1.2 : 1),
    // spread
    theme.elevatedShadowSpread
      ? theme.elevatedShadowSpread(x)
      : smoother(x, 2.5) * (darkTheme ? 1.2 : 1),
    // color
    theme.elevatedShadowColor
      ? theme.elevatedShadowColor(x)
      : [0, 0, 0, round(0.02 * smoother(x)) + (darkTheme ? 0.3 : 0)],
  ]
}

export const getElevation = (props: ElevatableProps, theme: ThemeObject) => {
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
          elevatedShadow(props.elevation, theme),
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
