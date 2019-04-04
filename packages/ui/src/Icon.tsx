import { gloss } from '@o/gloss'
import { mergeDefined } from '@o/utils'
import fuzzy from 'fuzzy'
import React, { createContext, memo, useContext } from 'react'
import { Config } from './helpers/configure'
import { iconNames } from './iconNames'
import { View, ViewProps } from './View/View'

export type IconProps = ViewProps & {
  size?: number
  name: string
  type?: 'mini' | 'outline'
  tooltip?: string
  tooltipProps?: Object
}

// TODO use createContextProps
export const IconPropsContext = createContext(null as Partial<IconProps>)

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

// lets users wrap around icons
export function Icon(rawProps: IconProps) {
  const extraProps = useContext(IconPropsContext)
  const props = extraProps ? mergeDefined(extraProps, rawProps) : rawProps
  const ResolvedIcon = Config.useIcon || PlainIcon
  return <ResolvedIcon {...props} />
}

export const PlainIcon = memo((rawProps: IconProps) => {
  const extraProps = useContext(IconPropsContext)
  const props = extraProps ? mergeDefined(extraProps, rawProps) : rawProps

  const {
    tooltip,
    tooltipProps,
    name,
    type = 'mini',
    children,
    color,
    margin = 0,
    ...restProps
  } = props

  if (!name) {
    return null
  }
  let content: any
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
  const size = props.size > 18 ? props.size * 0.85 : props.size || 16

  return (
    <IconInner color={color} {...restProps} size={size}>
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
})

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
