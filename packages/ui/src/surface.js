// @flow
import * as React from 'react'
import Theme from './helpers/theme'
import { view } from '@mcro/black'
import $ from 'color'
import Icon from './icon'
import HoverGlow from './effects/hoverGlow'
import Glint from './effects/glint'
import Popover from './popover'
import type { Color } from '@mcro/gloss'
import { object } from 'prop-types'

export type Props = {
  active?: boolean,
  after?: Element | string,
  align?: string,
  alignSelf?: string,
  background?: Color,
  badge?: React.Element<any>,
  badgeProps?: Object,
  border?: Array<any> | Object,
  borderBottom?: Array<any> | Object,
  borderBottomRadius?: number,
  borderLeft?: Array<any> | Object,
  borderLeftRadius?: number,
  borderRadius: number,
  borderRight?: Array<any> | Object,
  borderRightRadius?: number,
  borderStyle?: 'solid' | 'dotted',
  borderTop?: Array<any> | Object,
  borderTopRadius?: number,
  borderWidth?: number | string,
  boxShadow?: Array<any> | string,
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
  glint?: boolean,
  glow?: boolean,
  glowProps?: Object,
  height?: number,
  highlight?: boolean,
  hoverable?: boolean,
  hoverColor?: Color,
  hovered?: boolean,
  icon?: React.Element<any> | string,
  iconAfter?: boolean,
  iconColor?: Color,
  iconProps?: Object,
  iconSize?: number,
  inline?: boolean,
  justify?: string,
  lineHeight?: number | string,
  margin?: number | Array<number>,
  marginBottom?: number,
  marginLeft?: number,
  marginRight?: number,
  marginTop?: number,
  maxWidth?: number,
  minWidth?: number,
  noElement?: boolean,
  noWrap?: boolean,
  onClick?: Function,
  opacity?: number,
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
  uiContext?: boolean,
  width?: number,
  wrapElement?: boolean,
  borderRadius?: number,
}

const ICON_PAD = 10
const LINE_HEIGHT = 30
const DEFAULT_GLOW_COLOR = [255, 255, 255]
const BORDER_RADIUS_SIDES = [
  'borderBottomRadius',
  'borderTopRadius',
  'borderLeftRadius',
  'borderRightRadius',
]

const hasChildren = (children: any): boolean =>
  Array.isArray(children)
    ? children.reduce((a, b) => a || !!b, false)
    : !!children

@view.ui
export default class Surface extends React.PureComponent<Props> {
  static contextTypes = {
    provided: object,
  }

  static defaultProps = {
    borderStyle: 'solid',
    borderWidth: 0,
  }

  uniq = `SRFC-${Math.round(Math.random() * 100000000)}`

  onClick = (e: Event) => {
    e.preventDefault()
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }

  get uiContext() {
    return this.context.provided.uiContext
  }

  render() {
    const {
      active,
      after,
      align,
      alignSelf,
      background,
      badge,
      badgeProps,
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
      boxShadow,
      children,
      chromeless,
      circular,
      className,
      clickable,
      color,
      dim,
      disabled,
      elementProps,
      elevation,
      flex,
      flexFlow,
      focusable,
      fontSize,
      fontWeight,
      getRef,
      glint,
      glow,
      glowProps,
      height,
      highlight,
      highlightBackground,
      highlightColor,
      hover,
      hoverable,
      hoverBackground,
      hoverColor,
      hovered,
      icon,
      iconAfter,
      iconColor,
      iconProps,
      iconSize: _iconSize,
      inline,
      justify,
      lineHeight,
      margin,
      marginBottom,
      marginLeft,
      marginRight,
      marginTop,
      maxWidth,
      minWidth,
      noElement,
      noWrap,
      onClick,
      opacity,
      padding,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      placeholderColor,
      row,
      size,
      sizeIcon,
      spaced,
      stretch,
      style,
      tagName,
      textAlign,
      theme,
      tooltip,
      tooltipProps,
      width,
      wrapElement,
      ...props
    } = this.props
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

    let borderLeftRadius =
      _borderLeftRadius || themeValues.borderRadius.borderLeftRadius
    let borderRightRadius =
      _borderRightRadius || themeValues.borderRadius.borderRightRadius

    if (typeof borderLeftRadius === 'undefined') {
      borderLeftRadius = themeValues.radius
      borderRightRadius = themeValues.radius
    }

    const glowColor =
      (this.theme && themeValues.color.lighten(0.2)) || DEFAULT_GLOW_COLOR

    const contents = [
      <Glint
        key={0}
        if={glint}
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
        size={themeValues.iconSize}
        {...iconProps}
      />,
      <HoverGlow
        key={2}
        if={glow && !active && !disabled}
        full
        scale={1.3}
        show
        color={glowColor}
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
      tooltip && (
        <Popover
          key={4}
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
          popoverProps={{ style: { fontSize: 12 } }}
          {...tooltipProps}
        >
          {tooltip}
        </Popover>
      ),
    ].filter(Boolean)

    const surface = (
      <surface
        className={`${this.uniq} ${className || ''}`}
        ref={this.ref('surfaceRef').set}
        onClick={this.onClick}
        {...!wrapElement && passProps}
      >
        {after && (
          <wrap>
            <before>{contents}</before>
            <after>{after}</after>
          </wrap>
        )}
        {!after && contents}
      </surface>
    )

    if (theme) {
      return <Theme name={theme}>{surface}</Theme>
    }

    return surface
  }

  static style = {
    surface: {
      lineHeight: '1rem',
      position: 'relative',
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
      height: 'auto',
    },
    hasIconBefore: {
      // this adjusts for height
      marginLeft: ICON_PAD,
    },
    hasIconAfter: {
      marginRight: ICON_PAD,
    },
    iconAfter: {
      order: 3,
    },
  }

  static inlineStyle = {
    margin: [-3, 0],
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
    const uiContext = self.uiContext

    // sizes
    const size = props.size === true ? 1 : props.size || 1
    const height = props.height || (props.style && props.style.height)
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
        ? theme.hover.background
        : props.hoverBackground ||
          theme.hover.background ||
          (colorfulBg ? background.lighten(0.5) : background))

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
    const boxShadow =
      typeof props.boxShadow === 'string'
        ? [props.boxShadow]
        : props.boxShadow || []
    if (props.elevation) {
      boxShadow.push([
        0,
        (Math.log(props.elevation) + 1) * 3 + 1,
        (Math.log(props.elevation) + 1) * 10,
        [0, 0, 0, 1 / Math.log(props.elevation) * 0.15],
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
    let radius = props.circular ? height / 2 : props.borderRadius
    radius = radius === true ? height / 3.4 * size : radius
    radius = typeof radius === 'number' ? Math.round(radius) : radius

    const borderRadius = {}
    if (uiContext && uiContext.inSegment) {
      borderRadius.borderLeftRadius = uiContext.inSegment.first ? radius : 0
      borderRadius.borderRightRadius = uiContext.inSegment.last ? radius : 0
    } else if (props.circular) {
      borderRadius.borderRadius = size * LINE_HEIGHT
    } else {
      let hasSidesDefined = false
      for (const side of BORDER_RADIUS_SIDES) {
        if (props[side]) {
          hasSidesDefined = true
          if (props[side] === true) {
            borderRadius[side] = radius
          } else {
            borderRadius[side] = props[side]
          }
        }
      }
      if (!hasSidesDefined && radius) {
        borderRadius.borderRadius = radius
      }
    }
    if (Object.keys(borderRadius).length) {
      // always add hidden for things with radius
      borderRadius.overflow = props.overflow || 'hidden'
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
    const hoverStyle = (props.hover ||
      (!props.chromeless &&
        !props.disabled &&
        (props.hoverable || props.hoverBackground))) && {
        ...theme.hover,
        color: hoverColor,
        borderColor: hoverBorderColor,
        background: hoverBackground,
        ...props.hover,
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

    const focusable = props.focusable || (uiContext && uiContext.inForm)
    const focusStyle = !props.chromeless && {
      ...theme.focus,
      boxShadow: [...boxShadow, [0, 0, 0, 4, $(theme.focus.color).alpha(0.05)]],
    }

    const iconSize =
      props.iconSize || Math.round(size * 11 * (props.sizeIcon || 1))

    // TODO figure out better pattern for this
    self.themeValues = {
      iconSize,
      borderRadiusSize: radius,
      borderRadius,
      glintColor,
      color,
    }

    const flexFlow = props.flexFlow || props.row ? 'row' : 'column'
    const iconPad = props.icon ? `- ${iconSize + ICON_PAD}px` : ''

    const result = {
      element: {
        height,
        ...borderRadius,
        overflow: props.overflow || 'visible',
        flexFlow: props.noElement ? 'column' : flexFlow,
        fontSize: props.fontSize,
        fontWeight: props.fontWeight,
        lineHeight: props.lineHeight || 'inherit',
        justifyContent: props.justify,
        maxWidth: `calc(100% ${iconPad})`,
        maxHeight: '100%',
        textAlign: props.textAlign,
      },
      surface: {
        transform: {
          z: 0,
          ...props.transform,
        },
        position: props.position,
        zIndex: props.zIndex,
        opacity: props.opacity,
        minWidth: props.minWidth,
        maxWidth: props.maxWidth,
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
        flexFlow,
        ...borderRadius,
        margin: props.margin,
        borderWidth: props.borderWidth,
        borderStyle:
          props.borderStyle || props.borderWidth ? 'solid' : undefined,
        border: props.border,
        borderBottom: props.borderBottom,
        borderTop: props.borderTop,
        borderLeft: props.borderLeft,
        borderRight: props.borderRight,
        marginBottom: props.marginBottom,
        marginTop: props.marginTop,
        marginLeft:
          uiContext && uiContext.inSegment && !uiContext.inSegment.first
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

    return result
  }
}
