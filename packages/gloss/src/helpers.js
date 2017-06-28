// @flow
// flatten theme key
//   { theme: { dark: { h1: { color: 'red' } } } }
//     => { dark-button: { h1: { color: 'red' } } }
export function flattenThemes(themes: ?Object) {
  const themeObj = themes || {}
  let result = {}

  Object.keys(themeObj).forEach(tKey => {
    const theme = themeObj[tKey]

    if (typeof theme === 'object') {
      result = {
        ...result,
        // flatten themes to `theme-tag: {}`
        ...Object.keys(theme).reduce(
          (res, key) => ({ ...res, [`${tKey}-${key}`]: theme[key] }),
          {}
        ),
      }
    } else if (typeof theme === 'function') {
      // skip function themes
      return
    } else {
      console.log(
        `Note: themes must be an object or function, "${tKey}" is a ${typeof tKey}`
      )
    }
  })

  return result
}

export const isFunc = (x: any) => typeof x === 'function'
