import fuzzySort from 'fuzzysort'
import { toJS } from 'mobx'

export const stringify = x => JSON.stringify(toJS(x))

export const wordKey = word => word.join('-')

export const deepClone = obj => (obj ? JSON.parse(JSON.stringify(obj)) : obj)

export const getSlackDate = (time: number) => new Date(time)

export const fuzzyQueryFilter = <A extends Object[]>(query: string, results: A, extraOpts?): A => {
  if (!query) {
    return results
  }
  const res = fuzzySort
    .go(query, results, {
      keys: ['title', 'name'],
      // threshold: -25,
      limit: 8,
      ...extraOpts,
    })
    .map(x => x.obj) as A
  return res
}

export * from './hoverSettler'

export const sleep = ms => new Promise(res => setTimeout(res, ms))

export const getHeader = (message, key) => message.participants.find(x => x.type === key)
