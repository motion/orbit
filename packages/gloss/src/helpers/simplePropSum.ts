import { hashSum } from './hashSum'

const valCache = new WeakMap()

let id = 0
const next = () => `*${id++ % Number.MAX_VALUE}`

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
  const type = typeof val
  if (type === 'string' || type === 'number' || type === 'boolean') {
    return val
  }
  // functions and classes we should just use a key for the instance
  if (val.constructor) {
    const key = next()
    valCache.set(val, key)
    return key
  }
  if (val._equalityKey) {
    return val._equalityKey
  }
  if (Array.isArray(val)) {
    return val.map(hashVal).join('')
  }
  const res = hashSum(val)
  valCache.set(val, res)
  return res
}

export const simplePropSum = props => {
  let hash = ''
  for (const key in props) {
    const val = props[key]
    hash += `${key}${hashVal(val)}`
  }
  return hash
}
