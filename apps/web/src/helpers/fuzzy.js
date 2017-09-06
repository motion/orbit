// @flow
import matchSorter from 'match-sorter'

type FuzzyOpts = {
  keys: Array<string>,
}

export default function fuzzy(
  haystack: Array<any>,
  needle: string,
  { keys = ['title'] }: FuzzyOpts = {}
) {
  return matchSorter(haystack, needle, { keys })
}
