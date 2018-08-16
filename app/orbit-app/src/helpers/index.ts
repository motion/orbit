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
  (
    ((message.payload && message.payload.headers) || []).find(
      x => x.name === key,
    ) || {
      value: '',
    }
  ).value

export const getHeaderFromShort = bit => {
  if (!bit.data.messages || !bit.data.messages.length) {
    return null
  }
  const fromHeader = getHeader(bit.data.messages[0], 'From')
  if (!fromHeader) {
    return null
  }
  return fromHeader.replace(/ <.*/g, '')
}
