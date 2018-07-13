import * as React from 'react'
import { Theme } from './helpers/theme'
import { view, attachTheme } from '@mcro/black'
import $ from 'color'
import { Icon } from './Icon'
import { HoverGlow } from './effects/hoverGlow'
import { Glint } from './effects/glint'
import { Popover } from './Popover'
import { object } from 'prop-types'
import { Badge } from './Badge'
import { Color } from '@mcro/css'
// import { propsToStyles } from './helpers/propsToStyles'

const POPOVER_PROPS = { style: { fontSize: 12 } }

export type SurfaceProps = {
  active?: boolean
  after?: Element | string
  align?: string
  alignSelf?: string
  background?: Color
  badge?: React.ReactNode
  badgeProps?: Object
  border?: Array<any> | Object
  borderBottom?: Array<any> | Object
  borderBottomRadius?: number
  borderLeft?: Array<any> | Object
  borderLeftRadius?: number
  borderRight?: Array<any> | Object
  borderRightRadius?: number
  borderStyle?: 'solid' | 'dotted'
  borderTop?: Array<any> | Object
  borderTopRadius?: number
  borderWidth?: number | string
  boxShadow?: Array<any> | string
  children?: React.ReactNode
  name?: string
  chromeless?: boolean
  circular?: boolean
  className?: string
  clickable?: boolean
  color?: Color
  dim?: boolean
  elementProps?: Object
  elevation?: number
  flex?: boolean | number
  focusable?: boolean
  forwardRef?: React.Ref<any>
  glint?: boolean
  glow?: boolean
  glowProps?: Object
  height?: number
  highlight?: boolean
  hoverable?: boolean
  hovered?: boolean
  icon?: React.ReactNode | string
  iconAfter?: boolean
  iconColor?: Color
  iconProps?: Object
  iconSize?: number
  inline?: boolean
  justify?: string
  lineHeight?: number | string
  margin?: number | Array<number>
  marginBottom?: number
  marginLeft?: number
  marginRight?: number
  marginTop?: number
  maxWidth?: number
  minWidth?: number
  noElement?: boolean
  noWrap?: boolean
  onClick?: Function
  opacity?: number
  overflow?: 'hidden' | 'visible' | 'scroll' | 'default'
  padding?: number | Array<number>
  paddingBottom?: number
  paddingLeft?: number
  paddingRight?: number
  paddingTop?: number
  row?: boolean
  size?: number
  sizeIcon?: number
  spaced?: boolean
  stretch?: boolean
  tagName: string
  theme?: string
  tooltip?: string
  tooltipProps?: Object
  uiContext?: boolean
  width?: number
  wrapElement?: boolean
  borderRadius?: number
  alpha?: number
  dimmed?: boolean
  disabled?: boolean
  flexFlow?: string
  borderColor?: Color
  fontSize?: number | string
  fontWeight?: number
  placeholderColor?: Color
  highlightBackground?: Color
  highlightColor?: Color
  hoverStyle?: Object
  style?: Object
  textAlign?: string
  ignoreSegment?: boolean
  alignItems?: string
  justifyContent?: string
  backgroundAlpha?: number
  activeStyle?: Object
  sizeLineHeight?: boolean | number
  type?: string
}

const ICON_SCALE = 12
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

@attachTheme
@view.ui
class SurfaceInner extends React.Component<SurfaceProps> {
  static defaultProps = {
    iconPad: 8,
  }

  static contextTypes = {
    provided: object,
  }

  themeValues = null
  uniq = `SRFC-${Math.round(Math.random() * 100000000)}`

  get uiContext() {
    return this.context.provided.uiContext
  }

  render() {
    const {
      active,
      after,
      align,
      alignSelf,
      alpha,
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
      dimmed,
      disabled,
      elementProps,
      elevation,
      flex,
      flexFlow,
      focusable,
      fontSize,
      fontWeight,
      forwardRef,
      glint,
      glow,
      glowProps,
      height,
      highlight,
      highlightBackground,
      highlightColor,
      hoverStyle,
      hoverable,
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
      tooltip,
      tooltipProps,
      width,
      wrapElement,
      ignoreSegment,
      alignItems,
      justifyContent,
      backgroundAlpha,
      activeStyle,
      sizeLineHeight,
      theme,
      ...props
    } = this.props
    const stringIcon = typeof icon === 'string'
    const { themeValues } = this
    if (!themeValues) {
      console.warn('this is weird', this, 'sure you set a theme?', this.context)
      return null
    }
    const passProps = {
      tagName,
      ref: forwardRef,
      style,
      ...props,
    }
    // get border radius
    let borderLeftRadius =
      typeof _borderLeftRadius === 'number'
        ? _borderLeftRadius
        : themeValues.borderRadius.borderLeftRadius
    let borderRightRadius =
      typeof _borderRightRadius === 'number'
        ? _borderRightRadius
        : themeValues.borderRadius.borderRightRadius
    if (typeof borderLeftRadius === 'undefined') {
      borderLeftRadius = themeValues.borderRadiusSize
      borderRightRadius = themeValues.borderRadiusSize
    }
    const glowColor = (this.theme && themeValues.color) || DEFAULT_GLOW_COLOR
    const contents = (
      <>
        <Glint
          if={glint}
          key={0}
          size={size}
          borderLeftRadius={borderLeftRadius - 1}
          borderRightRadius={borderRightRadius - 1}
        />
        {badge && (
          <Badge {...badgeProps}>
            {typeof badge !== 'boolean' ? badge : ''}
          </Badge>
        )}
        <div $icon if={icon && !stringIcon}>
          {icon}
        </div>
        <Icon
          if={icon && stringIcon}
          $icon
          css={
            icon &&
            iconAfter && {
              order: 3,
            }
          }
          name={icon}
          size={themeValues.iconSize}
          {...iconProps}
        />
        <HoverGlow
          if={glow && !dimmed && !disabled}
          full
          scale={1.1}
          show={hovered}
          color={glowColor}
          opacity={0.35}
          borderLeftRadius={borderLeftRadius - 1}
          borderRightRadius={borderRightRadius - 1}
          {...glowProps}
        />
        <div
          $element
          if={!noElement || (noElement && !noWrap && hasChildren(children))}
          {...wrapElement && passProps}
          {...elementProps}
          disabled={disabled}
        >
          {children}
        </div>
        {noElement && noWrap && hasChildren(children) && children}
        <Theme if={tooltip} name="dark">
          <Popover
            background
            openOnHover
            closeOnClick
            noHoverOnChildren
            animation="bounce 150ms"
            target={`.${this.uniq}`}
            padding={[2, 7, 4]}
            borderRadius={5}
            distance={8}
            forgiveness={8}
            arrowSize={10}
            delay={400}
            popoverProps={POPOVER_PROPS}
            {...tooltipProps}
          >
            <span css={{ maxWidth: 200 }}>{tooltip}</span>
          </Popover>
        </Theme>
      </>
    )
    return (
      <surface
        className={`${this.uniq} ${className || ''}`}
        onClick={onClick}
        {...!wrapElement && passProps}
      >
        {after && (
          <wrap>
            <wrapContents>{contents}</wrapContents>
            <after>{after}</after>
          </wrap>
        )}
        {!after && contents}
      </surface>
    )
  }

  static style = {
    // fontFamily: inherit on both fixes noElement elements
    surface: {
      fontFamily: 'inherit',
      position: 'relative',
    },
    element: {
      fontFamily: 'inherit',
      border: 'none',
      background: 'transparent',
      height: '100%',
      color: 'inherit',
      // this seems to maybe fix some line height stuff
      transform: {
        y: '1%',
      },
    },
    icon: {
      pointerEvents: 'none',
      justifyContent: 'center',
      height: '1.4rem',
      transform: {
        y: '1%',
      },
    },
    wrap: {
      flex: 1,
      overflow: 'hidden',
    },
    after: {},
    wrapContents: {
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
    },
  }

  static inlineStyle = {
    display: 'inline',
  }

  static dimmedStyle = {
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

  static theme = ({ theme, ...props }, self) => {
    const uiContext = null
    // sizes
    const size = props.size === true ? 1 : props.size || 1
    const height = props.height || (props.style && props.style.height)
    const width = props.width
    const padding = props.padding
    const flex =
      props.flex === true
        ? 1
        : props.flex || (props.style && props.style.flex) || 'none'
    const STATE =
      (props.highlight && 'highlight') || (props.active && 'active') || 'base'

    // colors
    let color =
      props.color === false || props.color === 'inherit'
        ? 'inherit'
        : $(
            props.color ||
              (props.highlight && props.highlightColor) ||
              theme[STATE].color,
          )
    if (typeof props.alpha === 'number') {
      color = color.alpha(props.alpha)
    }
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
    if (typeof props.backgroundAlpha === 'number' && background.alpha) {
      background = background.alpha(props.backgroundAlpha)
    }

    let hoverBackground =
      !props.highlight &&
      (props.hover && props.hover.background === true
        ? theme.hover.background
        : (props.hover && props.hover.background) ||
          theme.hover.background ||
          (colorfulBg ? background.lighten(0.5) : background))
    if (
      hoverBackground &&
      props.hover &&
      typeof props.hover.backgroundAlpha === 'number'
    ) {
      hoverBackground = hoverBackground.alpha(props.hover.backgroundAlpha)
    }

    const borderColor = $(
      props.borderColor === true
        ? theme[STATE].borderColor
        : props.borderColor || 'transparent',
    )
    let hoverColor =
      props.color === false
        ? 'inherit'
        : $(
            (props.hover && props.hover.color) ||
              theme[STATE].color.lighten(0.2) ||
              props.color,
          )
    if (props.hover && typeof props.hover.alpha === 'number') {
      hoverColor = hoverColor.alpha(props.hover.alpha)
    }

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
        [0, 0, 0, (1 / Math.log(props.elevation)) * 0.15],
      ])
    }

    // glint
    let glintColor
    if (props.glint) {
      glintColor =
        props.glint === true
          ? colorfulBg
            ? background.lighten(0.1)
            : [255, 255, 255, 0.2]
          : props.glint
      // boxShadow.push(['inset', 0, 0, 0, glintColor])
    }

    // borderRadius
    let radius = props.circular ? height / 2 : props.borderRadius
    radius = radius === true ? (height / 3.4) * size : radius
    radius = typeof radius === 'number' ? Math.round(radius) : radius

    const borderRadius = {} as any
    if (uiContext && uiContext.inSegment && !props.ignoreSegment) {
      borderRadius.borderLeftRadius = uiContext.inSegment.first ? radius : 0
      borderRadius.borderRightRadius = uiContext.inSegment.last ? radius : 0
    } else if (props.circular) {
      borderRadius.borderRadius = size * LINE_HEIGHT
    } else {
      let hasSidesDefined = false
      for (const side of BORDER_RADIUS_SIDES) {
        const isDefined = typeof props[side] === 'number'
        if (isDefined) {
          hasSidesDefined = true
          if (props[side] === true) {
            borderRadius[side] = radius
          } else {
            borderRadius[side] = props[side]
          }
        } else {
          borderRadius[side] = radius
        }
      }
      if (!hasSidesDefined && radius) {
        borderRadius.borderRadius = radius
      }
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
      (!props.chromeless && !props.disabled && props.hoverable)) && {
      ...theme.hover,
      color: hoverColor,
      borderColor: hoverBorderColor,
      background: hoverBackground,
      ...props.hoverStyle,
    }
    let activeStyle = !props.chromeless && {
      position: 'relative',
      zIndex: props.zIndex || 1000,
    }
    if (props.active) {
      const userActiveStyle =
        props.activeStyle || (props.clickable && theme.active)
      if (userActiveStyle) {
        activeStyle = {
          ...activeStyle,
          ...userActiveStyle,
          '&:hover':
            userActiveStyle['&:hover'] || userActiveStyle || activeStyle,
        }
      }
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
      props.iconSize ||
      Math.round(size * ICON_SCALE * (props.sizeIcon || 1) * 100) / 100
    // TODO figure out better pattern for this
    self.themeValues = {
      iconSize,
      borderRadiusSize: radius,
      borderRadius,
      glintColor,
      color,
    }
    const flexFlow = props.flexFlow || 'row'
    const iconNegativePad = props.icon ? `- ${iconSize + props.iconPad}px` : ''
    const undoPadding = {
      margin: padding
        ? typeof padding === 'number'
          ? -padding
          : padding.map(x => -x)
        : 0,
      padding,
    }
    let elementGlowProps
    if (props.glow) {
      elementGlowProps = {
        position: 'relative',
        zIndex: 1,
      }
    }
    let surfaceStyles = {
      ...(props.inline && self.constructor.inlineStyle),
      transform: props.transform,
      position: props.position,
      zIndex: props.zIndex,
      opacity: props.opacity,
      minWidth: props.minWidth,
      maxWidth: props.maxWidth,
      color,
      overflow:
        props.overflow || props.glow
          ? props.overflow || 'hidden'
          : props.overflow,
      height,
      width,
      flex,
      padding,
      borderColor,
      background,
      boxShadow,
      fontWeight: props.fontWeight,
      justifyContent: props.justify || props.justifyContent,
      alignItems: props.align || props.alignItems,
      alignSelf: props.alignSelf,
      flexFlow,
      ...borderRadius,
      margin: props.margin,
      borderWidth: props.borderWidth,
      borderStyle: props.borderStyle || props.borderWidth ? 'solid' : undefined,
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
      '& > div > .icon': props.hovered ? hoverIconStyle : iconStyle,
      '&:hover > div > .icon': hoverIconStyle,
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
      ...(props.dimmed && self.constructor.dimmedStyle),
      ...(props.dim && self.constructor.dimStyle),
      ...(props.spaced && self.constructor.spacedStyle),
      ...chromelessStyle,
      ...(props.active && activeStyle),
      // // so you can override
      // ...props.style,
    }
    if (props.sizeLineHeight) {
      surfaceStyles.lineHeight = `${surfaceStyles.height}px`
    }
    // element styles
    const element = {
      ...(props.inline && self.constructor.inlineStyle),
      // this fixes inputs but may break other things, need to test
      height,
      ...borderRadius,
      ...elementGlowProps,
      overflow: props.overflow || 'visible',
      flexFlow,
      fontSize: props.fontSize || 'inherit',
      fontWeight: props.fontWeight,
      lineHeight: 'inherit',
      justifyContent: props.justify || props.justifyContent,
      maxWidth: `calc(100% ${iconNegativePad})`,
      // maxHeight: '100%',
      textAlign: props.textAlign,
    }
    // spacing between icon
    const hasIconBefore = props.icon && !props.iconAfter
    const hasIconAfter = props.icon && props.iconAfter
    if (hasIconBefore) {
      element.marginLeft = props.iconPad
    }
    if (hasIconAfter) {
      element.marginRight = props.iconPad
    }
    const result = {
      element,
      wrap: undoPadding,
      wrapContents: undoPadding,
      after: {
        marginTop: padding
          ? Array.isArray(padding)
            ? padding[0]
            : padding
          : 0,
      },
      surface: surfaceStyles,
    }

    return result
  }
}

export const Surface = React.forwardRef((props, ref) => (
  <SurfaceInner {...props} forwardRef={ref} />
))
