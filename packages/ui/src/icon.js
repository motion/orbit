// @flow
import * as React from 'react'
import { view } from '@mcro/black'
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
      attach,
      children,
      button,
      margin,
      opacity,
      style,
      contentEditable,
      alignSelf,
      width,
      height,
      ...props
    } = this.props
    const iconName = findMatch(name)
    let content = children || !iconName ? name : ''

    if (type === 'detailed') {
      content = (
        <detailIcon css={{ transform: { scale: 0.01 * size } }}>
          {iconsDetailed[name]}
        </detailIcon>
      )
    }

    const styles = {
      margin,
      alignSelf: alignSelf,
      alignItems: 'center',
      opacity: opacity,
      color: color ? `${$(color).toString()} !important` : '',
      width: width || size,
      height: height || size,
      fontSize: size,
      lineHeight: `${size / 12 - 1}rem`, // scale where 1 when 14
      '&:hover': hoverColor && {
        color: `${hoverColor.toString()} !important`,
      },
    }

    return (
      <icon
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
        <inner
          contentEditable={false}
          className={`nc-icon-${type} ${iconName}`}
          contentEditable={contentEditable}
          style={{
            margin: 'auto',
            textRendering: 'geometricPrecision',
          }}
        >
          {content}
        </inner>
        {tooltip &&
          log(
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
}
