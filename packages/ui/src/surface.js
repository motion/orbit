// @flow
import React from 'react'
import * as PropTypes from 'prop-types'
import { view, inject } from '@mcro/black'
import $ from 'color'
import Icon from './icon'
import Glow from './effects/glow'
import Popover from './popover'
import type { Color } from '@mcro/gloss'

const LINE_HEIGHT = 30

export type Props = {
  borderRadius: number,
  inSegment?: boolean,
  inForm?: boolean,
  clickable?: boolean,
  active?: boolean,
  chromeless?: boolean,
  inline?: boolean,
  dim?: boolean,
  stretch?: boolean,
  spaced?: boolean,
  highlight?: boolean,
  circular?: boolean,
  iconAfter?: boolean,
  iconColor?: Color,
  onClick?: Function,
  tooltip?: string,
  icon?: React$Element<any> | string,
  background?: Color,
  color?: Color,
  hoverColor?: Color,
  className?: string,
  theme?: string,
  after?: Element | string,
  children?: Element | string,
  iconProps?: Object,
  tooltipProps?: Object,
  tagName: string,
  size?: number,
  iconSize?: number,
  padding?: number | Array<number>,
  margin?: number | Array<number>,
  height?: number,
  noGlow?: boolean,
}

@inject(context => context.ui)
@view.ui
export default class Surface {
  props: Props

  static contextTypes = {
    uiTheme: PropTypes.object,
    uiActiveTheme: PropTypes.string,
  }

  static defaultProps = {
    tagName: 'div',
    size: 1,
  }

  uniq = `icon-${Math.round(Math.random() * 1000000)}`

  get theme() {
    return this.context.uiTheme[this.context.uiActiveTheme]
  }

  getStyles = () => {
    const { props, theme } = this
    if (!theme) {
      return null
    }

    // based on a vertical rythm
    // sizes
    const height = props.size * LINE_HEIGHT
    const padding = props.padding || [0, height / 4]
    const fontSize = props.fontSize || height * 0.5

    // radius
    const baseBorderRadius = props.borderRadius || height / 5
    const borderRadius = props.circular
      ? height
      : baseBorderRadius || height / 10

    // colors
    const background =
      props.background || theme.base.background || 'transparent'
    const borderColor = props.borderColor || theme.base.borderColor
    const color = props.highlight
      ? props.highlightColor || theme.highlight.color || props.color
      : props.active ? theme.active.color : props.color || theme.base.color
    const hoverColor =
      (props.highlight && $(color).lighten(0.2)) ||
      props.hoverColor ||
      theme.hover.color ||
      (props.color && $(props.color).lighten(0.2))
    const iconColor = props.iconColor || color
    const iconHoverColor = props.iconHoverColor || hoverColor

    const segmentStyles = props.inSegment && {
      marginLeft: -1,
      borderLeftRadius: props.inSegment.first ? borderRadius : 0,
      borderRightRadius: props.inSegment.last ? borderRadius : 0,
    }

    const surfaceStyle = {
      surface: {
        fontSize,
        lineHeight: '1px',
        padding,
        borderRadius,
        borderColor,
        color,
        background,
        ...segmentStyles,
        '& > icon': {
          color: iconColor,
        },
        '&:hover > icon': {
          color: iconHoverColor,
        },
        '&:hover': {
          ...theme.hover,
          color: hoverColor,
        },
        // this is just onmousedown
        '&:active': {
          position: 'relative',
          zIndex: 1000,
        },
        // inForm
        ...(props.inForm && {
          '&:active': theme.active,
          '&:focus': theme.focus,
        }),
      },
      isActive: {
        background: theme.active.background,
        borderColor: theme.active.borderColor,
        '&:hover': {
          color: hoverColor,
          background: theme.active.background,
          borderColor: theme.active.borderColor,
        },
        '&:hover > icon': {
          color: hoverColor,
        },
      },
    }

    return surfaceStyle
  }

  render({
    inSegment,
    inForm,
    onClick,
    clickable,
    children,
    icon,
    iconProps,
    iconSize: _iconSize,
    iconAfter,
    iconColor,
    color,
    active,
    highlight,
    spaced,
    after,
    chromeless,
    inline,
    dim,
    stretch,
    tagName,
    tooltip,
    tooltipProps,
    background,
    className,
    theme,
    circular,
    size,
    borderRadius,
    material,
    padding,
    height,
    margin,
    noGlow,
    hoverColor,
    ...props
  }: Props) {
    const curTheme = this.getStyles()
    if (curTheme) {
      this.constructor.theme.theme = () => curTheme
    }

    const hasIconBefore = icon && !iconAfter
    const hasIconAfter = icon && iconAfter
    const stringIcon = typeof icon === 'string'
    const iconSize =
      _iconSize ||
      (curTheme && curTheme.surface.fontSize * 0.85) ||
      Math.log(size + 1) * 15

    return (
      <surface
        tagName={tagName}
        $inSegment={inSegment && this.props}
        $clickable={!!onClick || clickable}
        $isActive={active}
        $highlight={highlight}
        className={`${className || ''} ${this.uniq}`}
        onClick={onClick}
        {...props}
      >
        <icon if={icon && !stringIcon} $iconAfter={hasIconAfter}>
          {icon}
        </icon>
        <Icon
          if={icon && stringIcon}
          $icon
          $iconAfter={hasIconAfter}
          name={icon}
          size={iconSize}
          {...iconProps}
        />
        <glowWrap if={!noGlow} $minimal={chromeless}>
          <Glow
            full
            scale={1.5}
            color={(curTheme && curTheme.surface.color) || [0, 0, 0]}
            opacity={0.06}
          />
        </glowWrap>
        <children
          if={children}
          $hasIconBefore={hasIconBefore}
          $hasIconAfter={hasIconAfter}
          style={{ color }}
        >
          {children}
        </children>
        {after || null}
        <Popover
          if={tooltip}
          theme="dark"
          background
          openOnHover
          noHover
          animation="bounce 150ms"
          target={`.${this.uniq}`}
          padding={[0, 6]}
          distance={8}
          arrowSize={8}
          delay={100}
          popoverProps={{ $$style: { fontSize: 11 } }}
          {...tooltipProps}
        >
          {tooltip}
        </Popover>
      </surface>
    )
  }

  static style = {
    surface: {
      background: 'transparent',
      overflow: 'hidden',
      lineHeight: '1rem',
      fontSize: 13,
      fontWeight: 400,
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderStyle: 'solid',
      position: 'relative',
      boxShadow: ['inset 0 0.5px 0 rgba(255,255,255,0.2)'],
    },
    glowWrap: {
      position: 'absolute',
      overflow: 'hidden',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10,
    },
    minimal: {
      boxShadow: 'none',
    },
    isActive: {
      background: '#eee',
      '&:hover': {
        background: '#eee',
      },
    },
    children: {
      userSelect: 'none',
    },
    icon: {
      pointerEvents: 'none',
    },
    hasIconBefore: {
      marginLeft: '0.7vh',
    },
    hasIconAfter: {
      marginRight: '0.7vh',
    },
    iconAfter: {
      order: 3,
    },
  }

  static theme = {
    size: props => ({
      surface: {
        height: props.size * LINE_HEIGHT,
      },
    }),
    circular: props => ({
      surface: {
        padding: 0,
        width: props.size * LINE_HEIGHT,
        borderRadius: props.size * LINE_HEIGHT,
      },
    }),
    spaced: {
      surface: {
        margin: [0, 5],
        borderRightWidth: 1,
      },
    },
    stretch: {
      surface: {
        flex: 1,
      },
    },
    chromeless: {
      surface: {
        background: 'transparent',
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        '&:hover': {
          opacity: 0.8,
        },
      },
      isActive: {
        background: [0, 0, 0, 0.1],
        '&:hover': {
          background: [0, 0, 0, 0.2],
        },
      },
    },
    inline: {
      surface: {
        background: 'transparent',
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        margin: [-2, -3],
        maxHeight: '1.45rem',
        borderRadius: 1000,
      },
    },
    disabled: {
      surface: {
        opacity: 0.25,
        pointerEvents: 'none',
      },
    },
    dim: {
      surface: {
        opacity: 0.5,
        '&:hover': {
          opacity: 1,
        },
      },
    },
  }
}
