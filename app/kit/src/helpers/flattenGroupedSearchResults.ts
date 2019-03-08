import { SearchResult } from '@o/models'
import { flatten } from 'lodash'

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
              group,
            },
          ]
        : []
    return [...firstFew, ...showMore]
  })
  return flatten(res)
}
