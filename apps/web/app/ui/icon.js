import React from 'react'
import { view } from '@jot/black'
import Popover from './popover'
import names from './iconNames'
import fuzzy from 'fuzzy'

const cache = {}
const findMatch = (name: string) => {
  if (cache[name]) return cache[name]
  if (names[name]) return names[name]
  const matches = fuzzy.filter(name, names)
  const match = matches.length ? matches[0].original : null
  cache[name] = match
  return match
}

@view.ui
export default class Icon {
  props: {
    size: number,
    color: Array | string,
    type: string,
    button?: Boolean,
  }

  static defaultProps = {
    size: 16,
    color: [0, 0, 0, 0.4],
    // hoverColor: [255,255,255,0.7],
    type: 'mini',
    margin: 0,
  }

  uniq = `icon-${Math.round(Math.random() * 1000000)}`

  render() {
    const {
      color,
      hoverColor,
      size,
      tooltip,
      tooltipProps,
      name,
      type,
      className,
      onClick,
      attach,
      children,
      button,
      margin,
      style,
      ...props
    } = this.props

    const iconName = findMatch(name)
    const backupIcon = !iconName ? name : ''

    return (
      <icon
        contentEditable={false}
        className={`${className || ''} ${this.uniq}`}
        onClick={onClick}
        style={{
          margin: margin || (style && style.margin),
          ...style,
        }}
        {...props}
      >
        <inner
          contentEditable={false}
          className={`nc-icon-${type} ${iconName}`}
        >
          {children || backupIcon}
        </inner>
        <Popover
          if={tooltip}
          dark
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
      </icon>
    )
  }

  static style = {
    icon: {
      alignItems: 'center',
    },
    inner: {
      margin: 'auto',
      textRendering: 'geometricPrecision',
    },
  }

  static theme = {
    button: {
      icon: {
        borderRadius: 3,
        alignItems: 'center',
        padding: 5,
        margin: -5,
        background: [0, 0, 0, 0.02],
        '&:hover': {
          background: [0, 0, 0, 0.02],
        },
      },
    },
    color: ({ color }) => ({
      icon: {
        color,
      },
    }),
    hoverColor: ({ hoverColor }) => ({
      icon: {
        '&:hover': {
          color: hoverColor,
        },
      },
    }),
    size: ({ size, width, height, button }) => {
      const buttonPad = button ? 5 : 0
      return {
        icon: {
          width: (width || size) + buttonPad * 2,
          height: height || size + buttonPad * 2,
          fontSize: size,
          lineHeight: `${size / 12 - 0.1}rem`, // scale where 1 when 14
        },
      }
    },
  }
}
