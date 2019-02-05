import { Color, CSSPropertySet, gloss, View } from '@mcro/gloss'
import fuzzy from 'fuzzy'
import * as React from 'react'
import { iconNames } from './iconNames'

export type IconProps = React.HTMLAttributes<HTMLDivElement> &
  CSSPropertySet & {
    size: number
    color?: Color
    type?: 'mini' | 'outline'
    opacity?: number
    tooltip?: string
    tooltipProps?: Object
    name: string
  }

const widthPadding = x => {
  if (typeof x === 'number') {
    return x * 2
  }
  if (Array.isArray(x)) {
    return x[1] + (typeof x[3] === 'number' ? x[3] : x[1])
  }
  return 0
}

const heightPadding = x => {
  if (typeof x === 'number') {
    return x * 2
  }
  if (Array.isArray(x)) {
    return x[0] + (typeof x[2] === 'number' ? x[2] : x[0])
  }
  return 0
}

const cache = {}
const findMatch = (name: string) => {
  if (cache[name]) return cache[name]
  if (iconNames[name]) return iconNames[name]
  const matches = fuzzy.filter(name, iconNames)
  const match = matches.length ? matches[0].original : 'none'
  cache[name] = match
  return match
}

export const Icon = React.memo(
  ({
    tooltip,
    tooltipProps,
    name,
    type = 'mini',
    children,
    color,
    margin = 0,
    ...props
  }: IconProps) => {
    if (!name) {
      return null
    }
    let content
    if (name[0] === '/') {
      // @ts-ignore
      return <img src={name} {...props} />
    }
    if (!name) {
      console.warn('no name given for icon')
      return null
    }
    content = content || children

    const iconName = findMatch(name)
    // icons here are consistently a bit too big...
    const size = props.size > 18 ? props.size * 0.65 : props.size

    return (
      <IconInner color={color} {...props} size={size}>
        <div
          className={`icon nc-icon-${type} ${iconName}`}
          style={{
            margin: 'auto',
            textRendering: 'geometricPrecision',
          }}
        >
          {content}
        </div>
      </IconInner>
    )
  },
)

const IconInner = gloss(View, {
  userSelect: 'none',
  alignItems: 'center',
  justifyContent: 'center',
}).theme(({ padding, width: pWidth, height: pHeight, size, color }, theme) => {
  const width = (pWidth || size) + widthPadding(padding)
  const height = (pHeight || size) + heightPadding(padding)
  return {
    color: color || theme.iconColor || theme.color,
    width,
    height,
    fontSize: size, // * 4,
    lineHeight: `${size / 12}rem`, // scale where 1 when 14
  }
})
