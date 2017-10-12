// @flow
import matchSorter from 'match-sorter'

type FuzzyOpts = {
  keys: Array<string>,
}

const toSearchable = thing => {
  const getText = data => (data.contents ? data.contents.text : '')
  if (thing.type === 'doc') {
    thing.searchable = thing.data.data
      ? getText(thing.data.data)
      : getText(thing.data)
  }

  if (!thing.searchable) thing.searchable = ''
  return thing
}

export default function fuzzy(
  haystack: Array<any>,
  needle: string,
  { keys = ['title', 'searchable'] }: FuzzyOpts = {}
) {
  return matchSorter(haystack.map(toSearchable), needle, { keys })
}
