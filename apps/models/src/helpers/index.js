// @flow
export const isBrowser = typeof window !== 'undefined'
export const isNode = !isBrowser

declare type Object$PropertyDescriptor = {
  configurable?: boolean,
  enumerable?: boolean,
  get?: Function,
  set?: Function,
  value?: any,
  writable?: boolean,
}

declare class Object {
  static getOwnPropertyDescriptors: (o: any) => Object$PropertyDescriptor,
  static defineProperties: (a: any, b: any) => void,
}

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
