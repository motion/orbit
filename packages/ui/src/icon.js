// @flow
import { view } from '@mcro/black'
import * as React from 'react'
import Popover from './popover'
import iconNames from './iconNames'
import iconsDetailed from './iconsDetailed'
import fuzzy from 'fuzzy'

const cache = {}
const findMatch = (name: string) => {
  if (cache[name]) return cache[name]
  if (iconNames[name]) return iconNames[name]
  const matches = fuzzy.filter(name, iconNames)
  const match = matches.length ? matches[0].original : 'none'
  cache[name] = match
  return match
}

export type Props = {
  size: number,
  color: Array | string,
  type: 'mini' | 'outline',
  button?: Boolean,
  opacity?: number,
}

@view.ui
export default class Icon extends React.PureComponent<Props> {
  static defaultProps = {
    size: 16,
    type: 'mini',
    margin: 0,
  }

  uniq = `icon-${Math.round(Math.random() * 1000000)}`

  render({
    color,
    hoverColor,
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
    hover,
    padding,
    ...props
  }) {
    let content
    if (type === 'detailed') {
      content = (
        <detailIcon css={{ transform: { scale: 0.01 * size } }}>
          {iconsDetailed[name]}
        </detailIcon>
      )
    }
    if (name[0] === '/') {
      return <img $icon src={name} {...props} />
    }
    const iconName = findMatch(name)
    content = content || children
    return (
      <icon {...props}>
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
      </icon>
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
      hoverColor,
      hover,
      background,
    },
    theme
  ) => {
    return {
      icon: {
        margin,
        padding,
        opacity,
        alignSelf,
        background,
        color: theme.color || color,
        width: (width || size) + padding * 2,
        height: (height || size) + padding * 2,
        fontSize: size,
        lineHeight: `${size / 12 - 1}rem`, // scale where 1 when 14
        '&:hover': {
          color: '#fff' || hoverColor || theme.color || color,
          ...hover,
        },
      },
    }
  }
}
