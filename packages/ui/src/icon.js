// @flow
import * as React from 'react'
import $ from 'color'
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

export default class Icon extends React.PureComponent<Props> {
  static defaultProps = {
    size: 16,
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
      children,
      margin,
      opacity,
      style,
      contentEditable,
      alignSelf,
      width,
      height,
      ...props
    } = this.props
    let content

    if (type === 'detailed') {
      content = (
        <detailIcon css={{ transform: { scale: 0.01 * size } }}>
          {iconsDetailed[name]}
        </detailIcon>
      )
    }

    const styles = {
      margin,
      opacity,
      alignSelf,
      alignItems: 'center',
      color: color ? $(color).toString() : '',
      width: width || size,
      height: height || size,
      fontSize: size,
      lineHeight: `${size / 12 - 1}rem`, // scale where 1 when 14
      '&:hover': hoverColor && {
        color: hoverColor.toString(),
      },
    }

    if (name[0] === '/') {
      return <img style={{ ...styles, ...style }} src={name} />
    }

    const iconName = findMatch(name)
    content = content || children || !iconName ? name : ''

    return (
      <div
        contentEditable={false}
        className={`${className || ''} ${this.uniq}`}
        onClick={onClick}
        style={{
          ...styles,
          ...style,
        }}
        {...props}
        contentEditable={contentEditable}
      >
        <div
          contentEditable={false}
          className={`nc-icon-${type} ${iconName}`}
          contentEditable={contentEditable}
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
}
