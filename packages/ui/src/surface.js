// @flow
import React from 'react'
import { Theme } from '@mcro/gloss'
import { view, inject } from '@mcro/black'
import type { ViewType } from '@mcro/black'
import $ from 'color'
import Icon from './icon'
import Glow from './effects/glow'
import Glint from './effects/glint'
import Popover from './popover'
import type { Color } from '@mcro/gloss'

const IS_PROD = process.env.NODE_ENV === 'production'

const LINE_HEIGHT = 30
const DEFAULT_GLOW_COLOR = [0, 0, 0]
const BORDER_RADIUS_SIDES = [
  'borderBottomRadius',
  'borderTopRadius',
  'borderLeftRadius',
  'borderRightRadius',
]

const hasChildren = children =>
  Array.isArray(children)
    ? children.reduce((a, b) => a || !!b, false)
    : !!children

@inject(context => context.uiContext)
@view.ui
export default class Surface implements ViewType {
  props: {
    active?: boolean,
    after?: Element | string,
    align?: string,
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
    justify?: string,
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
    row?: boolean,
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

  uniq = `SRFC-${Math.round(Math.random() * 100000000)}`

  render({
    active,
    after,
    align,
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
    justify,
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
    row,
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
    const iconSize = _iconSize || (size || 1) * 12

    const passProps = {
      tagName,
      ref: getRef,
      style,
      ...props,
    }

    const surface = (
      <surface
        className={`${this.uniq} ${className || ''}`}
        ref={this.ref('surfaceRef').set}
        onClick={onClick}
        {...!wrapElement && passProps}
      >
        <Glint
          if={glint && this.theme}
          color={this.theme.glintColor.style.color}
          borderRadius={
            (this.theme.element.style.borderRadius ||
              this.theme.element.style.borderTopLeftRadius) + 1
          }
        />
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
          scale={1.4}
          color={
            (this.theme && $(this.theme.surface.style.color).lighten(0.2)) ||
            DEFAULT_GLOW_COLOR
          }
          opacity={0.15}
          {...glowProps}
        />
        <element
          if={!noElement || (noElement && hasChildren(children))}
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
          padding={[2, 7]}
          borderRadius={5}
          distance={8}
          forgiveness={8}
          arrowSize={10}
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
      alignItems: 'flex-start',
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

    // background
    const baseBackground =
      props.background === true
        ? theme.base.background
        : props.background || theme.base.background
    let hoverBackground = props.hoverBackground
    let background = props.active
      ? props.activeBackground || theme.active.background || baseBackground
      : baseBackground
    const colorBackground =
      background !== 'transparent' &&
      (typeof background !== 'string' ||
        (background.indexOf('linear-gradient') !== 0 &&
          background.indexOf('radial-gradient') !== 0))
    if (colorBackground) {
      background = $(background)
      const luminosity = background.luminosity()
      const isDark = luminosity < 0.4
      const addContrast = (color, amt) =>
        color[isDark ? 'lighten' : 'darken'](amt)
      // hover
      hoverBackground =
        hoverBackground || props.hoverable
          ? addContrast(background, luminosity / 30)
          : background
    }

    const borderColor = $(
      props.borderColor || theme.base.borderColor || 'transparent'
    )
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

    // glint
    let glintColor
    if (props.glint) {
      glintColor =
        props.glint === true
          ? colorBackground ? background.lighten(0.1) : [255, 255, 255, 0.2]
          : props.glint
      // boxShadow.push(['inset', 0, 0, 0, glintColor])
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
    } else if (props.circular) {
      borderRadius.borderRadius = props.size * LINE_HEIGHT
    } else {
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
    }
    if (Object.keys(borderRadius).length) {
      // always add hidden for things with radius
      borderRadius.overflow = 'hidden'
    }

    // circular
    const circularStyles = props.circular && {
      padding: 0,
      width: height,
    }

    return {
      glintColor,
      element: {
        color,
        height,
        ...borderRadius,
        fontSize: props.fontSize,
        lineHeight: 'inherit',
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
        justifyContent: props.justify,
        alignItems: props.align,
        flexFlow: props.flexFlow || props.row ? 'row' : 'column',
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
          background: 'transparent',
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
          background: hoverBackground,
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
