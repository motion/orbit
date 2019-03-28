import naturalCompare from 'string-natural-compare'

export const getSortedKeys = (obj: Object): string[] => Object.keys(obj).sort(naturalCompare)
