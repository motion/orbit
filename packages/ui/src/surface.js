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
const DEFAULT_GLOW_COLOR = [255, 255, 255]
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

@inject(context => ({ uiContext: context.uiContext }))
@view.ui
export default class Surface implements ViewType {
  props: {
    opacity?: number,
    active?: boolean,
    after?: Element | string,
    align?: string,
    alignSelf?: string,
    badge?: React$Element<any>,
    badgeProps?: Object,
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
    lineHeight?: number | string,
    borderTopRadius?: number,
    borderWidth?: number | string,
    children?: Element | string,
    chromeless?: boolean,
    circular?: boolean,
    className?: string,
    clickable?: boolean,
    color?: Color,
    dim?: boolean,
    elementProps?: Object,
    elevation?: number,
    flex?: boolean | number,
    focusable?: boolean,
    getRef?: Function,
    noWrap?: boolean,
    glint?: boolean,
    glow?: boolean,
    glowProps?: Object,
    height?: number,
    highlight?: boolean,
    hoverable?: boolean,
    hoverColor?: Color,
    hovered?: boolean,
    icon?: React$Element<any> | string,
    iconAfter?: boolean,
    iconColor?: Color,
    iconProps?: Object,
    iconSize?: number,
    uiContext?: boolean,
    inline?: boolean,
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
    sizeIcon?: number,
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

  onClick = e => {
    e.preventDefault()
    e.persist()
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }

  render({
    active,
    after,
    align,
    badge,
    badgeProps,
    background,
    border,
    borderBottom,
    borderBottomRadius,
    borderColor,
    borderLeft,
    borderLeftRadius: _borderLeftRadius,
    borderRadius: _borderRadius,
    borderRight,
    borderRightRadius: _borderRightRadius,
    borderStyle,
    borderTop,
    borderTopRadius,
    borderWidth,
    children,
    chromeless,
    circular,
    className,
    clickable,
    color,
    dim,
    elementProps,
    elevation,
    flex,
    focusable,
    getRef,
    glint,
    glow,
    glowProps,
    height,
    highlight,
    hovered,
    hoverable,
    hoverColor,
    icon,
    iconAfter,
    lineHeight,
    iconColor,
    iconProps,
    iconSize: _iconSize,
    uiContext,
    inline,
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
    alignSelf,
    opacity,
    paddingRight,
    paddingTop,
    placeholderColor,
    row,
    size,
    spaced,
    stretch,
    sizeIcon,
    style,
    tagName,
    theme,
    tooltip,
    noWrap,
    tooltipProps,
    width,
    wrapElement,
    disabled,
    ...props
  }) {
    const hasIconBefore = icon && !iconAfter
    const hasIconAfter = icon && iconAfter
    const stringIcon = typeof icon === 'string'
    const { themeValues } = this

    const passProps = {
      tagName,
      ref: getRef,
      style,
      ...props,
    }

    const borderLeftRadius = _borderLeftRadius || themeValues.borderRadius
    const borderRightRadius = _borderRightRadius || themeValues.borderRadius

    const contents = [
      <Glint
        key={0}
        if={glint && this.theme}
        size={size}
        borderLeftRadius={borderLeftRadius - 1}
        borderRightRadius={borderRightRadius - 1}
      />,
      <badge if={badge} {...badgeProps}>
        {typeof badge !== 'boolean' ? badge : ''}
      </badge>,
      <icon key={1} if={icon && !stringIcon} $iconAfter={hasIconAfter}>
        {icon}
      </icon>,
      <Icon
        key={1}
        if={icon && stringIcon}
        $icon
        $iconAfter={hasIconAfter}
        name={icon}
        size={this.themeValues.iconSize}
        {...iconProps}
      />,
      <Glow
        key={2}
        if={glow && !active && !disabled}
        full
        scale={1.3}
        show={hovered}
        color={
          (this.theme && this.themeValues.color.lighten(0.2)) ||
          DEFAULT_GLOW_COLOR
        }
        opacity={0.2}
        borderLeftRadius={borderLeftRadius - 1}
        borderRightRadius={borderRightRadius - 1}
        {...glowProps}
      />,
      <element
        key={3}
        if={!noElement || (noElement && !noWrap && hasChildren(children))}
        {...wrapElement && passProps}
        {...elementProps}
        $hasIconBefore={hasIconBefore}
        $hasIconAfter={hasIconAfter}
      >
        {children}
      </element>,
      noElement && noWrap && hasChildren(children) && children,
      <Popover
        key={4}
        if={tooltip}
        theme="dark"
        background
        openOnHover
        closeOnClick
        noHover
        noArrow
        animation="bounce 150ms"
        target={`.${this.uniq}`}
        padding={[2, 7]}
        borderRadius={5}
        distance={8}
        forgiveness={8}
        arrowSize={10}
        delay={100}
        popoverProps={{ $$style: { fontSize: 12 } }}
        {...tooltipProps}
      >
        {tooltip}
      </Popover>,
    ]

    const surface = (
      <surface
        className={`${this.uniq} ${className || ''}`}
        ref={this.ref('surfaceRef').set}
        onClick={this.onClick}
        {...!wrapElement && passProps}
      >
        {after &&
          <wrap>
            <before>
              {contents}
            </before>
            <after>
              {after}
            </after>
          </wrap>}
        {!after && contents}
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
      position: 'relative',
      borderStyle: 'solid',
    },
    element: {
      border: 'none',
      background: 'transparent',
      userSelect: 'none',
      height: '100%',
      flex: 1,
      color: 'inherit',
    },
    icon: {
      pointerEvents: 'none',
    },
    hasIconBefore: {
      // this adjusts for height
      marginLeft: 'calc(5px + 1.5%)',
    },
    hasIconAfter: {
      marginRight: 'calc(5px + 1.5%)',
    },
    iconAfter: {
      order: 3,
    },
  }

  static inlineStyle = {
    margin: [-3, -3],
    borderRadius: 1000,
  }

  static disabledStyle = {
    opacity: 0.2,
    // pointerEvents: 'none',
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
    const STATE =
      (props.highlight && 'highlight') || (props.active && 'active') || 'base'

    // colors
    const color = $(
      props.color ||
        (props.highlight && props.highlightColor) ||
        theme[STATE].color
    )
    const iconColor = props.iconColor || color

    // background
    const baseBackground =
      props.background === true
        ? theme[STATE].background
        : props.background || theme[STATE].background
    let background = props.highlight
      ? props.highlightBackground || theme.highlight.background
      : props.active
        ? props.activeBackground || theme.active.background || baseBackground
        : baseBackground

    const isGradient =
      typeof background === 'string' &&
      (background.indexOf('linear-gradient') === 0 ||
        background.indexOf('radial-gradient') === 0)
    const isTransparent = background === 'transparent'
    const colorfulBg = !isGradient && !isTransparent

    if (colorfulBg && background && !background.model) {
      background = $(background)
    }

    const hoverBackground =
      !props.highlight &&
      (props.hoverBackground === true
        ? theme[STATE].background
        : props.hoverBackground ||
          (colorfulBg ? background.negate().alpha(0.1) : background))

    const borderColor = $(
      props.borderColor || theme[STATE].borderColor || 'transparent'
    )
    let hoverColor = $(
      props.hoverColor || theme[STATE].color.lighten(0.2) || props.color
    )

    const hoverBorderColor =
      props.hoverBorderColor ||
      (props.borderColor && $(props.borderColor).lighten(0.2)) ||
      theme[STATE].borderColor ||
      theme.hover.borderColor ||
      borderColor.lighten(0.2)

    // shadows
    const boxShadow = props.boxShadow || []
    if (props.elevation) {
      boxShadow.push([
        0,
        props.elevation * 3,
        props.elevation * 15,
        [0, 0, 0, 0.15],
      ])
    }

    // glint
    let glintColor
    if (props.glint) {
      glintColor =
        props.glint === true
          ? colorfulBg ? background.lighten(0.1) : [255, 255, 255, 0.2]
          : props.glint
      // boxShadow.push(['inset', 0, 0, 0, glintColor])
    }

    // borderRadius
    const borderRadiusSize = props.circular ? height / 2 : props.borderRadius
    const borderRadius = {}
    if (props.uiContext && props.uiContext.inSegment) {
      borderRadius.borderLeftRadius = props.uiContext.inSegment.first
        ? borderRadiusSize
        : 0
      borderRadius.borderRightRadius = props.uiContext.inSegment.last
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

    // icon
    const iconStyle = {
      color: iconColor,
    }
    const hoverIconStyle = {
      color: props.iconHoverColor || hoverColor,
    }

    // state styles
    const hoverStyle = !props.chromeless &&
    !props.disabled &&
    (props.hoverable || props.hoverBackground) && {
      ...theme.hover,
      color: hoverColor,
      borderColor: hoverBorderColor,
      background: hoverBackground,
    }
    const activeStyle = !props.chromeless && {
      position: 'relative',
      zIndex: props.zIndex || 1000,
      ...(props.clickable && theme[STATE]),
      ...(props.clickable && { '&:hover': theme[STATE] }),
    }

    const chromelessStyle = props.chromeless && {
      borderWidth: 0,
      background: 'transparent',
    }

    const focusable =
      props.focusable || (props.uiContext && props.uiContext.inForm)
    const focusStyle = !props.chromeless && {
      ...theme.focus,
      boxShadow: [...boxShadow, [0, 0, 0, 4, $(theme.focus.color).alpha(0.05)]],
    }

    const iconSize =
      props.iconSize ||
      Math.round((props.size || 1) * 11 * (props.sizeIcon || 1))

    // TODO figure out better pattern for this
    self.themeValues = {
      iconSize,
      borderRadiusSize,
      glintColor,
      color,
    }

    return {
      element: {
        height,
        ...borderRadius,
        overflow: 'visible',
        fontSize: props.fontSize,
        lineHeight: props.lineHeight || 'inherit',
        justifyContent: props.justify,
        maxWidth: `calc(100% - ${props.icon ? iconSize + 5 : 0}px)`,
        textAlign: props.textAlign,
      },
      surface: {
        opacity: props.opacity,
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
        alignSelf: props.alignSelf,
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
        marginLeft:
          props.uiContext &&
          props.uiContext.inSegment &&
          !props.uiContext.inSegment.first
            ? -1
            : props.marginLeft,
        marginRight: props.marginRight,
        paddingBottom: props.paddingBottom,
        paddingTop: props.paddingTop,
        paddingLeft: props.paddingLeft,
        paddingRight: props.paddingRight,
        ...circularStyles,
        '& > icon': props.hovered ? hoverIconStyle : iconStyle,
        '&:hover > icon': hoverIconStyle,
        '&:hover': hoverStyle,
        '&:focus-within': focusable && focusStyle,
        ...(props.wrapElement && {
          '& > :focus': focusable && focusStyle,
          '& > :active': activeStyle,
        }),
        ...(!props.wrapElement && {
          '&:focus': focusable && focusStyle,
          '&:active': activeStyle,
        }),
        ...(props.hovered && hoverStyle),
        ...(props.inline && self.constructor.inlineStyle),
        ...(props.disabled && self.constructor.disabledStyle),
        ...(props.dim && self.constructor.dimStyle),
        ...(props.spaced && self.constructor.spacedStyle),
        ...chromelessStyle,
        ...(props.active && activeStyle),
        // so you can override
        ...props.style,
      },
    }
  }
}
