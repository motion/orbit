import { CSSPropertySetResolved } from '@o/css'

export type ElevatableProps = {
  elevation?: number
  boxShadow?: CSSPropertySetResolved['boxShadow']
}

const round = (x: number) => Math.round(x * 30) / 30
const smoother = (base: number, amt = 1) =>
  round((Math.log(Math.max(1, base + 0.2)) + 0.75) * amt * 2)

const elevatedShadow = (x: number) => [
  // x
  0,
  // y
  smoother(x, 1),
  // spread
  smoother(x, 2.5),
  // color
  [0, 0, 0, round(0.02 * smoother(x))],
]

export const getElevation = (props: ElevatableProps) => {
  return cachedReturn(JSON.stringify([props.elevation, props.boxShadow]), () => {
    if (!props.elevation) {
      return {
        boxShadow: props.boxShadow,
      }
    }
    return {
      boxShadow: [
        elevatedShadow(props.elevation),
        ...(Array.isArray(props.boxShadow) ? props.boxShadow : []),
      ],
    }
  })
}

// this may be a bit stupid (bad on memory surely)
// im trying this because <Arrow /> via <Popover /> was showing huge render cost
// and getElevation was causing new props to return every render
const cache = {}
const cachedReturn = (a: string, cb: Function) => {
  if (cache[a]) {
    return cache[a]
  }
  cache[a] = cb()
  return cache[a]
}
