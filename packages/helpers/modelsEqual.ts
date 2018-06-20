import { comparer } from 'mobx'

const isEqual = comparer.structural

// compare model
export function modelEqual(a: any, b: any, keys = ['updatedAt']) {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  if (!isEqual(aKeys, bKeys)) {
    return false
  }
  for (const key of aKeys) {
    if (keys.indexOf(key) === -1) {
      continue
    }
    if (!isEqual(b[key], a[key])) {
      return false
    }
  }
  return true
}


export function modelsEqual(a: any[], b: any[], keys?) {
  if (a.length !== b.length) {
    return false
  }
  for (const [index, aItem] of a.entries()) {
    if (!modelEqual(aItem, b[index], keys)) {
      return false
    }
  }
  return true
}
