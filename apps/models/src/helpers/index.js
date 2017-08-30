// @flow
export const isBrowser = typeof window !== 'undefined'
export const isNode = !isBrowser

// this lets you extend objects that have getters
// helpful for sub-models that want to extend other models methods
export const extend = (a: Object, b: Object) => {
  const result = {}
  const ad = Object.getOwnPropertyDescriptors(a)
  const bd = Object.getOwnPropertyDescriptors(b)
  Object.defineProperties(result, ad)
  Object.defineProperties(result, bd)
  return result
}
