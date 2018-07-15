import { view } from '@mcro/black'
import * as React from 'react'
import { Popover } from './Popover'
import { iconNames } from './iconNames'
import fuzzy from 'fuzzy'
import { Color } from '@mcro/css'
import { View } from './blocks/View'

export type IconProps = {
  size: number
  color: Color
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
})

IconInner.theme = ({ padding, width: propWidth, height: propHeight, size }) => {
  const width = (propWidth || size) + widthPadding(padding)
  const height = (propHeight || size) + heightPadding(padding)
  return {
    width,
    height,
    fontSize: size,
    lineHeight: `${size / 12}rem`, // scale where 1 when 14
  }
}

export class Icon extends React.Component<IconProps> {
  static defaultProps = {
    size: 16,
    type: 'mini',
    margin: 0,
  }

  uniq = `icon-${Math.round(Math.random() * 1000000)}`

  render() {
    const {
      tooltip,
      tooltipProps,
      name,
      type,
      children,
      color,
      ...props
    } = this.props
    let content
    if (name[0] === '/') {
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
        {tooltip && (
          <Popover
            theme="dark"
            background
            openOnHover
            noArrow
            noHoverOnChildren
            target={`.${this.uniq}`}
            padding={[0, 5]}
            distance={10}
            towards="top"
            {...tooltipProps}
          >
            {tooltip}
          </Popover>
        )}
      </IconInner>
    )
  }
}
