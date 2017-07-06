// @flow
import React from 'react'
import { view } from '@mcro/black'
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

export type Props = {
  size: number,
  color: Array | string,
  type: 'mini' | 'outline',
  button?: Boolean,
}

@view.ui
export default class Icon {
  props: Props

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
    onClick,
    attach,
    children,
    button,
    margin,
    style,
    ...props
  }: Props) {
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

  static theme = props => {
    const buttonPad = props.button ? 5 : 0
    const buttonStyles = props.button && {
      borderRadius: 3,
      alignItems: 'center',
      padding: 5,
      margin: -5,
      background: [0, 0, 0, 0.02],
      '&:hover': {
        background: [0, 0, 0, 0.02],
      },
    }

    return {
      icon: {
        color: props.color ? `${props.color} !important` : '',
        width: (props.width || props.size) + buttonPad * 2 + 1,
        height: (props.height || props.size) + buttonPad * 2 + 1,
        fontSize: props.size,
        lineHeight: `${props.size / 12 - 0.1}rem`, // scale where 1 when 14
        ...buttonStyles,
        '&:hover': {
          color: props.hoverColor,
        },
      },
    }
  }
}
