// @flow
import React from 'react'
import { Theme } from '@mcro/gloss'
import { view, inject } from '@mcro/black'
import type { ViewType } from '@mcro/black'
import $ from 'color'
import Icon from './icon'
import Glow from './effects/glow'
import Popover from './popover'
import type { Color } from '@mcro/gloss'

const IS_PROD = process.env.NODE_ENV === 'production'

const LINE_HEIGHT = 30
const BORDER_RADIUS_SIDES = [
  'borderBottomRadius',
  'borderTopRadius',
  'borderLeftRadius',
  'borderRightRadius',
]

@inject(context => context.uiContext)
@view.ui
export default class Surface implements ViewType {
  props: {
    active?: boolean,
    after?: Element | string,
    background?: Color,
    border?: Array | Object,
    borderBottom?: Array | Object,
    borderBottomRadius?: number,
    borderLeft?: Array | Object,
    borderLeftRadius?: number,
    borderRadius: number,
    borderRight?: Array | Object,
    borderRightRadius?: number,
    borderStyle?: 'solid' | 'dotted',
    borderTop?: Array | Object,
    borderTopRadius?: number,
    borderWidth?: number | string,
    children?: Element | string,
    chromeless?: boolean,
    circular?: boolean,
    className?: string,
    color?: Color,
    dim?: boolean,
    elementProps?: Object,
    elevation?: number,
    flex?: boolean | number,
    getRef?: Function,
    glint?: boolean,
    glow?: boolean,
    glowProps?: Object,
    height?: number,
    height?: number,
    highlight?: boolean,
    hoverable?: boolean,
    hoverColor?: Color,
    icon?: React$Element<any> | string,
    iconAfter?: boolean,
    iconColor?: Color,
    iconProps?: Object,
    iconSize?: number,
    inForm?: boolean,
    inline?: boolean,
    inSegment?: boolean,
    margin?: number | Array<number>,
    marginBottom?: number,
    marginLeft?: number,
    marginRight?: number,
    marginTop?: number,
    noElement?: boolean,
    onClick?: Function,
    overflow?: 'hidden' | 'visible' | 'scroll' | 'default',
    padding?: number | Array<number>,
    paddingBottom?: number,
    paddingLeft?: number,
    paddingRight?: number,
    paddingTop?: number,
    size?: number,
    spaced?: boolean,
    stretch?: boolean,
    tagName: string,
    theme?: string,
    tooltip?: string,
    tooltipProps?: Object,
    width?: number,
    wrapElement?: boolean,
  }

  static defaultProps = {
    tagName: IS_PROD ? 'div' : 'surface',
    borderStyle: 'solid',
    borderWidth: 0,
  }

  uniq = `icon-${Math.round(Math.random() * 1000000)}`

  render({
    active,
    after,
    background,
    border,
    borderBottom,
    borderBottomRadius,
    borderColor,
    borderLeft,
    borderLeftRadius,
    borderRadius,
    borderRight,
    borderRightRadius,
    borderStyle,
    borderTop,
    borderTopRadius,
    borderWidth,
    children,
    chromeless,
    circular,
    className,
    color,
    dim,
    elementProps,
    elevation,
    flex,
    getRef,
    glint,
    glow,
    glowProps,
    height,
    highlight,
    hoverable,
    hoverColor,
    icon,
    iconAfter,
    iconColor,
    iconProps,
    iconSize: _iconSize,
    inForm,
    inline,
    inSegment,
    margin,
    marginBottom,
    marginLeft,
    marginRight,
    marginTop,
    material,
    noElement,
    onClick,
    padding,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingTop,
    placeholderColor,
    size,
    spaced,
    stretch,
    style,
    tagName,
    theme,
    tooltip,
    tooltipProps,
    width,
    wrapElement,
    ...props
  }) {
    const hasIconBefore = icon && !iconAfter
    const hasIconAfter = icon && iconAfter
    const stringIcon = typeof icon === 'string'
    const iconSize = _iconSize || (size || 1) * 15

    const finalClassName = `${this.uniq} ${className || ''}`
    const passProps = {
      className: finalClassName,
      tagName,
      ref: getRef,
      style,
      ...props,
    }

    const surface = (
      <surface onClick={onClick} {...!wrapElement && passProps}>
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
        <Glow
          if={glow}
          full
          scale={1.5}
          color={(this.theme && this.theme.surface.style.color) || [0, 0, 0]}
          opacity={0.14}
          {...glowProps}
        />
        <element
          if={!noElement || (noElement && children)}
          {...wrapElement && passProps}
          {...elementProps}
          $hasIconBefore={hasIconBefore}
          $hasIconAfter={hasIconAfter}
        >
          {children}
        </element>
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

    if (theme) {
      return (
        <Theme name={theme}>
          {surface}
        </Theme>
      )
    }

    return surface
  }

  static style = {
    surface: {
      lineHeight: '1rem',
      fontWeight: 400,
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    element: {
      border: 'none',
      background: 'transparent',
      userSelect: 'none',
      height: '100%',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch',
    },
    icon: {
      pointerEvents: 'none',
    },
    hasIconBefore: {
      marginLeft: '1vh',
    },
    hasIconAfter: {
      marginRight: '1vh',
    },
    iconAfter: {
      order: 3,
    },
  }

  static surfaceStyle = {
    background: 'transparent',
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    margin: [-2, -3],
    maxHeight: '1.45rem',
    borderRadius: 1000,
  }

  static disabledStyle = {
    opacity: 0.25,
    pointerEvents: 'none',
  }

  static dimStyle = {
    opacity: 0.5,
    '&:hover': {
      opacity: 1,
    },
  }

  static spacedStyles = {
    margin: [0, 5],
    borderRightWidth: 1,
  }

  static theme = (props, theme, self) => {
    // sizes
    const height = props.height
    const width = props.width
    const padding = props.padding
    const flex = props.flex === true ? 1 : props.flex

    // colors
    const color = $(
      props.highlight
        ? props.highlightColor || theme.highlight.color || props.color
        : props.active ? theme.active.color : props.color || theme.base.color
    )
    const iconColor = props.iconColor || color
    const baseBackground =
      props.background || theme.base.background || 'transparent'
    const background = $(
      props.active
        ? props.activeBackground || theme.active.background || baseBackground
        : baseBackground
    )
    const borderColor = $(
      props.borderColor || theme.base.borderColor || 'transparent'
    )

    // color helpers
    const luminosity = background.luminosity()
    const isDark = luminosity < 0.4
    const addContrast = (color, amt) =>
      color[isDark ? 'lighten' : 'darken'](amt)

    // hover
    const hoverBackgroundColor =
      props.hoverBackgroundColor || props.hoverable
        ? addContrast(background, luminosity / 30)
        : background
    let hoverColor = $(
      props.highlight
        ? color.lighten(0.2)
        : props.hoverColor || theme.hover.color || props.color
    )
    const hoverBorderColor =
      props.hoverBorderColor ||
      theme.hover.borderColor ||
      borderColor.lighten(1)

    // shadows
    const boxShadow = props.boxShadow || []
    if (props.elevation) {
      boxShadow.push([
        0,
        props.elevation * 2.5,
        props.elevation * 7.5,
        [0, 0, 0, 0.16],
      ])
    }
    if (props.glint) {
      const glintColor =
        props.glint === true ? background.lighten(0.4) : props.glint
      boxShadow.push(['inset', 0, '0.5px', 0, glintColor])
    }

    // borderRadius
    const borderRadiusSize = props.circular ? height : props.borderRadius
    const borderRadius = {}
    if (props.inSegment) {
      borderRadius.borderLeftRadius = props.inSegment.first
        ? borderRadiusSize
        : 0
      borderRadius.borderRightRadius = props.inSegment.last
        ? borderRadiusSize
        : 0
    }
    let hasSidesDefined = false
    for (const side of BORDER_RADIUS_SIDES) {
      if (props[side]) {
        hasSidesDefined = true
        if (props[side] === true) {
          borderRadius[side] = borderRadiusSize
        } else {
          borderRadius[side] = props[side]
        }
      }
    }
    if (!hasSidesDefined && borderRadiusSize) {
      borderRadius.borderRadius = borderRadiusSize
    }

    // circular
    const circularStyles = props.circular && {
      padding: 0,
      width: height,
      borderRadius: props.size * LINE_HEIGHT,
      overflow: 'hidden',
    }

    return {
      element: {
        color,
        ...props.elementStyles,
        ...borderRadius,
        fontSize: props.fontSize,
        lineHeight: '0px',
      },
      surface: {
        color,
        overflow: props.overflow || props.glow ? 'hidden' : props.overflow,
        height,
        width,
        flex,
        padding,
        borderColor,
        background,
        boxShadow,
        ...borderRadius,
        margin: props.margin,
        borderWidth: props.borderWidth,
        borderStyle: props.borderStyle,
        border: props.border,
        borderBottom: props.borderBottom,
        borderTop: props.borderTop,
        borderLeft: props.borderLeft,
        borderRight: props.borderRight,
        marginBottom: props.marginBottom,
        marginTop: props.marginTop,
        marginLeft: props.inSegment ? -1 : props.marginLeft,
        marginRight: props.marginRight,
        paddingBottom: props.paddingBottom,
        paddingTop: props.paddingTop,
        paddingLeft: props.paddingLeft,
        paddingRight: props.paddingRight,
        ...circularStyles,
        ...(props.wrapElement &&
        props.inForm && {
          '& > :active': theme.active,
          '& > :focus': theme.focus,
        }),
        ...(!props.wrapElement &&
        props.inForm && {
          '&:active': theme.active,
          '&:focus': theme.focus,
        }),
        ...(props.inline && self.constructor.surfaceStyle),
        ...(props.disabled && self.constructor.disabledStyle),
        ...(props.dim && self.constructor.dimStyle),
        ...(props.spaced && self.constructor.spacedStyle),
        ...(props.chromeless && {
          borderWidth: 0,
        }),
        '& > icon': {
          color: iconColor,
        },
        '&:hover > icon': {
          color: props.iconHoverColor || hoverColor,
        },
        '&:hover': {
          ...theme.hover,
          color: hoverColor,
          borderColor: hoverBorderColor,
          backgroundColor: hoverBackgroundColor,
        },
        // this is just onmousedown
        '&:active': {
          position: 'relative',
          zIndex: 1000,
        },
        // so you can override
        ...props.style,
      },
    }
  }
}
