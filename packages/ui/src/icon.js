// @flow
import React from 'react'
import { view } from '@mcro/black'
import color from 'color'
import Popover from './popover'
import names from './iconNames'
import iconsDetailed from './iconsDetailed'
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
  opacity?: number,
}

@view.ui
export default class Icon extends React.Component {
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
    opacity,
    style,
    contentEditable,
    alignSelf,
    ...props
  }: Props) {
    const iconName = findMatch(name)
    let content = children || !iconName ? name : ''

    if (type === 'detailed') {
      content = (
        <detailIcon css={{ transform: { scale: 0.01 * size } }}>
          {iconsDetailed[name]}
        </detailIcon>
      )
    }

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
        contentEditable={contentEditable}
      >
        <inner
          contentEditable={false}
          className={`nc-icon-${type} ${iconName}`}
          contentEditable={contentEditable}
        >
          {content}
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
    return {
      icon: {
        alignSelf: props.alignSelf,
        opacity: props.opacity,
        color: props.color ? `${color(props.color).toString()} !important` : '',
        width: props.width || props.size,
        height: props.height || props.size,
        fontSize: props.size,
        lineHeight: `${props.size / 12 - 1}rem`, // scale where 1 when 14
        '&:hover': props.hoverColor && {
          color: `${props.hoverColor.toString()} !important`,
        },
      },
    }
  }
}
