import memoize from 'memoize-weak'
import { ThemeObject } from '@mcro/css'

export default memoize(function selectThemeSubset(prefix: string, theme: ThemeObject) {
  const len = prefix.length
  const o1 = { ...theme }
  for (const key in theme) {
    if (key.indexOf(prefix) === 0) {
      const newKey = key.slice(len)
      const newKeyCamelCase = `${newKey[0].toLowerCase()}${newKey.slice(1)}`
      o1[newKeyCamelCase] = theme[key]
    }
  }
  return o1
})
