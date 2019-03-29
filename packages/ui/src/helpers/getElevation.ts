import { ThemeObject } from '@o/css'

const round = (x: number) => Math.round(x * 10) / 10
const smoother = (base: number, amt = 1) => round((Math.log(Math.max(1, base + 0.2)) + 1) * amt)
const elevatedShadow = (x: number) => [
  0,
  smoother(x, 2),
  smoother(x, 14),
  [0, 0, 0, round(0.05 * smoother(x))],
]

export function getElevation(props: { elevation?: number }, _theme?: ThemeObject) {
  if (!props.elevation) {
    return null
  }
  return {
    boxShadow: [elevatedShadow(props.elevation) as any],
  }
}
