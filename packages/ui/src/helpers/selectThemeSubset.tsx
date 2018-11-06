import memoize from 'memoize-weak'
import { ThemeObject } from '@mcro/css'

export const selectThemeSubset = memoize((prefix: string, o: ThemeObject) => {
  const len = prefix.length
  const o1 = { ...o }
  for (const key in o) {
    if (key.indexOf(prefix) === 0) {
      const newKey = key.slice(len)
      const newKeyCamelCase = `${newKey[0].toLowerCase()}${newKey.slice(1)}`
      o1[newKeyCamelCase] = o[key]
    }
  }
  return o1
})
