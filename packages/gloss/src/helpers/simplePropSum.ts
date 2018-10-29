import { hashSum } from './hashSum'

window['hashSum'] = hashSum

const valCache = new WeakMap()

const hashVal = val => {
  // ignore react children
  if (val && val['_owner'] && val['$$typeof']) {
    return ''
  }
  if (!val) {
    return val
  }
  if (valCache.has(val)) {
    return valCache.get(val)
  }
  if (Array.isArray(val)) {
    return val.map(hashVal).join('')
  }
  if (val._equalityKey) {
    return val._equalityKey
  }
  const type = typeof val
  if (type === 'string' || type === 'number' || type === 'boolean') {
    return val
  }
  const res = hashSum(val)
  valCache.set(val, res)
  return res
}

export const simplePropSum = props => {
  const start = Date.now()
  let hash = ''
  for (const key in props) {
    const val = props[key]
    hash += hashVal(val)
  }
  if (Date.now() - start > 100) {
    debugger
  }
  return hash
}
