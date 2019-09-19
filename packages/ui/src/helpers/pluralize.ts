import pluralizeOg from 'pluralize'

// add types
export const pluralize = (word: string, count: number, inclusize?: boolean) => {
  return pluralizeOg(word, count, inclusize)
}
