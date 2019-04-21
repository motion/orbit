import { CSSPropertySetResolved } from '@o/css'

export type ElevatableProps = {
  elevation?: number
  boxShadow?: CSSPropertySetResolved['boxShadow']
}

const round = (x: number) => Math.round(x * 20) / 20
const smoother = (base: number, amt = 1) =>
  round((Math.log(Math.max(1, base + 0.2)) + 0.75) * amt * 2)

const elevatedShadow = (x: number) => [
  // x
  0,
  // y
  smoother(x, 1),
  // spread
  smoother(x, 2),
  // color
  [0, 0, 0, round(0.025 * smoother(x))],
]

export function getElevation(props: ElevatableProps) {
  if (!props.elevation) {
    return {
      boxShadow: props.boxShadow,
    }
  }
  return {
    boxShadow: [
      elevatedShadow(props.elevation),
      ...(Array.isArray(props.boxShadow) ? props.boxShadow : null),
    ],
  }
}
