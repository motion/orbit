import { view } from '@mcro/black'
import * as React from 'react'
import { iconNames } from './iconNames'
import fuzzy from 'fuzzy'
import { View } from './blocks/View'
import { Color, CSSPropertySet } from '@mcro/gloss'

export type IconProps = CSSPropertySet & {
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
const findMatch = name => {
  if (cache[name]) return cache[name]
  if (iconNames[name]) return iconNames[name]
  const matches = fuzzy.filter(name, iconNames)
  const match = matches.length ? matches[0].original : 'none'
  cache[name] = match
  return match
}

const IconInner = view(View, {
  userSelect: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  // transform: { scale: 0.25 },
  // transformOrigin: 'center left',
}).theme(({ padding, width: propWidth, height: propHeight, size, theme, color }) => {
  const width = (propWidth || size) + widthPadding(padding)
  const height = (propHeight || size) + heightPadding(padding)
  return {
    color: color || theme.iconColor || theme.color,
    width,
    height,
    fontSize: size, // * 4,
    lineHeight: `${size / 12}rem`, // scale where 1 when 14
  }
})

export class Icon extends React.Component<IconProps> {
  static defaultProps = {
    size: 16,
    type: 'mini',
    margin: 0,
  }

  uniq = `icon-${Math.round(Math.random() * 1000000)}`

  render() {
    const { tooltip, tooltipProps, name, type, children, color, ...props } = this.props
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
    const iconName = findMatch(name)
    content = content || children
    return (
      <IconInner color={color} {...props}>
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
  }
}
