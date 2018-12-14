import { CSSPropertySet } from './cssPropertySet'

/*
 *  Setup valid CSS attributes object
 */

type CSSPropertyKey = keyof CSSPropertySet
type ValidCSSPropertyMap = { [key in CSSPropertyKey]: boolean }

const allCSSAttr = {}
// add standard ones
if (typeof document !== 'undefined') {
  for (const key of Object.keys(document.body.style)) {
    allCSSAttr[key] = true
  }
}
const cssSpecialAttr = {
  borderLeftRadius: true,
  borderRightRadius: true,
  borderBottomRadius: true,
  borderTopRadius: true,
}
export const validCSSAttr: Partial<ValidCSSPropertyMap> = {
  ...allCSSAttr,
  ...cssSpecialAttr,
}

// various helpful constants

export const UNDEFINED = 'undefined'
export const COLOR_KEYS = new Set(['color', 'backgroundColor', 'borderColor'])
export const TRANSFORM_KEYS_MAP = {
  x: 'translateX',
  y: 'translateY',
  z: 'translateZ',
  dropShadow: 'drop-shadow',
}

export const COMMA_JOINED = {
  boxShadow: true,
  transition: true,
}

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

export const BORDER_KEY = {
  border: true,
  borderLeft: true,
  borderRight: true,
  borderBottom: true,
  borderTop: true,
}

export const psuedoKeys = {
  // pseudoclasses
  '&:hover': true,
  '&:active': true,
  '&:checked': true,
  '&:focus': true,
  '&:enabled': true,
  '&:disabled': true,
  '&:empty': true,
  '&:target': true,
  '&:required': true,
  '&:valid': true,
  '&:invalid': true,
  // psuedoelements
  '&:before': true,
  '&:after': true,
  '&:placeholder': true,
  '&:selection': true,
}

export const unitlessNumberProperties = new Set([
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
