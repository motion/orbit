import { validCSSAttr } from '@o/css'

import { isPlainObj } from './helpers'

/**
 * Helpful function that works with gloss themes. Takes same arguments as a
 * ThemeFn. Normally, returning an object in gloss overwrites, whereas this
 * will merge deep.
 *
 * @param next next styles to merge on top
 * @param previous last styles to write onto
 * @param options can choose:
 *   - iterate: what to iterate over (theme, props, or next = the object given)
 *   - overwrite: whether to overwrite or defer to previous
 */

type MergeStylesOptions = {
  iterate?: 'next' | 'props' | 'theme'
  overwrite?: boolean
}

export function mergeStyles(props?: any, next?: Object | null, cur?: Object | null, { overwrite = false }: MergeStylesOptions = {}) {
  if (!next) return
  // if we are running first, return instead of assign
  let shouldReturn = false
  if (!cur) {
    cur = {}
    shouldReturn = true
  }

  for (const key in next) {
    const val = next[key]
    if (!val) continue
    const propVal = props?.[key]
    if (cur[key] === true) cur[key] = {}
    const curVal = cur[key]
    if (validCSSAttr[key]) {
      cur[key] = (overwrite ? null : curVal) ?? val ?? propVal
      continue
    }
    // apply pseudo/media style sub-objects
    if (isPlainObj(val)) {
      if (propVal === false || propVal === null) continue
      if (!curVal) {
        cur[key] = val ?? propVal
      } else {
        for (const skey in next[key]) {
          if (validCSSAttr[skey]) {
            cur[key][skey] = (overwrite ? null : curVal[skey]) ?? val?.[skey] ?? propVal?.[skey]
          }
        }
      }
    }
  }

  if (shouldReturn) {
    return cur
  }
}
