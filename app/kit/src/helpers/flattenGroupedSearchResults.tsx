import { gloss } from '@o/gloss'
import { SearchResult } from '@o/models'
import { flatten } from 'lodash'
import React from 'react'

const groupToName = {
  'last-day': 'Recently',
  'last-week': 'Recently',
  'last-month': 'Last Month',
  overall: 'Overall',
}

export function flattenGroupedSearchResults(
  results: SearchResult[],
  {
    max = 6,
  }: {
    max?: number
  } = {},
) {
  const res = results.map(result => {
    const group = groupToName[result.group]
    const firstFew = result.bits.slice(0, max).map(bit => ({
      item: bit,
      group,
    }))
    const showMore =
      result.bitsTotalCount > max - 1
        ? [
            {
              title: result.title,
              subtitle: result.text,
              before: <CircleCount count={result.bitsTotalCount} />,
              group,
            },
          ]
        : []
    return [...firstFew, ...showMore]
  })
  return flatten(res)
}

export function CircleCount(props: { count: number }) {
  const num = abbreviateNumber(props.count)
  return <Circle style={{ fontSize: num.length > 2 ? 15 : 18 }}>{num}</Circle>
}

const Circle = gloss({
  width: 40,
  height: 40,
  margin: ['auto', 14, 'auto', 0],
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 300,
  borderRadius: 100,
}).theme((_, theme) => ({
  background: theme.backgroundAlt,
  color: theme.color,
}))

function abbreviateNumber(num: number, fixed = 0) {
  if (num === null) {
    return null
  } // terminate early
  if (num === 0) {
    return '0'
  } // terminate early
  fixed = !fixed || fixed < 0 ? 0 : fixed // number of decimal places to show
  let b = num.toPrecision(2).split('e') // get power
  let k = b.length === 1 ? 0 : Math.floor(Math.min(+b[1].slice(1), 14) / 3) // floor at decimals, ceiling at trillions
  let c = k < 1 ? num.toFixed(0 + fixed) : (num / Math.pow(10, k * 3)).toFixed(1 + fixed) // divide by power
  let d = +c < 0 ? c : Math.abs(+c) // enforce -0 is 0
  let e = d + ['', 'k', 'm', 'b', 't'][k] // append power
  return e
}
