import { CSSPropertySet } from './cssPropertySet'

/*
 *  Setup valid CSS attributes object
 */

type CSSPropertyKey = keyof CSSPropertySet
type ValidCSSPropertyMap = { [key in CSSPropertyKey]: boolean }

export const validCSSAttr: Partial<ValidCSSPropertyMap> =
  process.env.RENDER_TARGET === 'node'
    ? require('./validCSSAttribute.node').default
    : require('./validCSSAttribute.dom').default

const existing = new Set()
export const cssAttributeAbbreviations = Object.keys(validCSSAttr).reduce((acc, key) => {
  let found = ''
  if (key.length < 4) {
    found = `${key}`
  } else {
    let i = 1
    while (true) {
      const abbrevs = getAbbrevs(key)
      found = abbrevs.slice(0, i).join('')
      if (i > abbrevs.length) {
        found += `${i}`
      }
      if (!existing.has(found)) break
      i++
    }
  }
  existing.add(found)
  acc[key] = found
  return acc
}, {})

function getAbbrevs(key: string) {
  let options = [key[0]]
  const uppercases = key.match(/[A-Z]/g)
  if (uppercases) options = [...options, ...uppercases]
  return options
}

console.log('cssAttributeAbbreviations', cssAttributeAbbreviations)

// various helpful constants

export const UNDEFINED = 'undefined'

// TODO this could be dynamic
// not the best tradeoff here for understanding where you can pass in colors
export const COLOR_KEYS = new Set<string>([
  'color',
  'background',
  'backgroundColor',
  'borderColor',
  'borderBottomColor',
  'borderTopColor',
  'borderLeftColor',
  'borderRightColor',
  'textDecorationColor',
])

export const TRANSFORM_KEYS_MAP = {
  x: 'translateX',
  y: 'translateY',
  z: 'translateZ',
  dropShadow: 'drop-shadow',
}

export const COMMA_JOINED = new Set(['boxShadow', 'transition'])

export const SHORTHANDS = {
  borderLeftRadius: ['borderTopLeftRadius', 'borderBottomLeftRadius'],
  borderRightRadius: ['borderTopRightRadius', 'borderBottomRightRadius'],
  borderBottomRadius: ['borderBottomLeftRadius', 'borderBottomRightRadius'],
  borderTopRadius: ['borderTopRightRadius', 'borderTopLeftRadius'],
}

export const FALSE_VALUES = {
  background: 'transparent',
  backgroundColor: 'transparent',
  borderColor: 'transparent',
}

export const BORDER_KEY = new Set([
  'border',
  'borderLeft',
  'borderRight',
  'borderBottom',
  'borderTop',
])

export const unitlessNumberProperties = new Set<string>([
  'animationIterationCount',
  'borderImageOutset',
  'borderImageSlice',
  'borderImageWidth',
  'columnCount',
  'flex',
  'flexGrow',
  'flexPositive',
  'flexShrink',
  'flexOrder',
  'gridRow',
  'gridColumn',
  'fontWeight',
  'lineClamp',
  'opacity',
  'order',
  'orphans',
  'tabSize',
  'widows',
  'zIndex',
  'zoom',
  'fillOpacity',
  'floodOpacity',
  'stopOpacity',
  'strokeDasharray',
  'strokeDashoffset',
  'strokeMiterlimit',
  'strokeOpacity',
  'strokeWidth',
])
