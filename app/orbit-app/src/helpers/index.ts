import fuzzySort from 'fuzzysort'

export const deepClone = obj =>
  obj
    ? Object.keys(obj).reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: JSON.parse(JSON.stringify(obj[cur])),
        }),
        {},
      )
    : obj

export const getSlackDate = (time: number) => new Date(time)

export const fuzzy = (query, results, extraOpts?) =>
  !query
    ? results
    : fuzzySort
        .go(query, results, {
          keys: ['title', 'name'],
          // threshold: -25,
          limit: 8,
          ...extraOpts,
        })
        .map(x => x.obj)

export * from './hoverSettler'

export const sleep = ms => new Promise(res => setTimeout(res, ms))

export const getHeader = (message, key) =>
  message.participants.find(x => x.type === key)
