import { view } from '@mcro/black'
import * as React from 'react'
import Popover from './popover'
import iconNames from './iconNames'
import iconsDetailed from './iconsDetailed'
import fuzzy from 'fuzzy'

const widthPadding = x => {
  if (typeof x === 'number') {
    return x * 2
  }
  if (Array.isArray(x)) {
    return x[1] + (typeof x[3] === 'number' ? x[3] : x[1])
  }
}

const heightPadding = x => {
  if (typeof x === 'number') {
    return x * 2
  }
  if (Array.isArray(x)) {
    return x[0] + (typeof x[2] === 'number' ? x[2] : x[0])
  }
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

// export type Props = {
//   size: number,
//   color: Array | string,
//   type: 'mini' | 'outline',
//   button?: Boolean,
//   opacity?: number,
// }

@view.ui
export default class Icon extends React.PureComponent {
  static defaultProps = {
    size: 16,
    type: 'mini',
    margin: 0,
  }

  uniq = `icon-${Math.round(Math.random() * 1000000)}`

  render({
    color,
    hover,
    size,
    tooltip,
    tooltipProps,
    name,
    type,
    className,
    children,
    margin,
    opacity,
    alignSelf,
    width,
    height,
    padding,
    ...props
  }) {
    let content
    if (type === 'detailed') {
      content = (
        <div $detailedIcon css={{ transform: { scale: 0.01 * size } }}>
          {iconsDetailed[name]}
        </div>
      )
    }
    if (name[0] === '/') {
      return <img $icon src={name} {...props} />
    }
    const iconName = findMatch(name)
    content = content || children
    return (
      // @ts-ignore
      <div $icon {...props}>
        <div
          className={`nc-icon-${type} ${iconName}`}
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
            noHover
            target={`.${this.uniq}`}
            padding={[0, 5]}
            distance={10}
            towards="top"
            {...tooltipProps}
          >
            {tooltip}
          </Popover>
        )}
      </div>
    )
  }

  static style = {
    icon: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  }

  static theme = (
    {
      margin,
      padding,
      opacity,
      alignSelf,
      color,
      width,
      height,
      size,
      hover,
      background,
    },
    theme,
  ) => {
    return {
      icon: {
        margin,
        padding,
        opacity,
        alignSelf,
        background,
        color: color || (theme && theme.color) || '#000',
        width: (width || size) + widthPadding(padding),
        height: (height || size) + heightPadding(padding),
        fontSize: size * 1.2,
        lineHeight: `${size / 12 - 1}rem`, // scale where 1 when 14
        '&:hover': {
          color: (hover && hover.color) || theme.color || color,
          ...hover,
        },
      },
    }
  }
}
