import * as React from 'react'
import { Theme } from '@mcro/gloss'
import { view, attachTheme } from '@mcro/black'
import $ from '@mcro/color'
import { View } from './blocks/View'
import { Icon } from './Icon'
import { HoverGlow } from './effects/HoverGlow'
import { Glint } from './effects/Glint'
import { Popover } from './Popover'
import { object } from 'prop-types'
import { Badge } from './Badge'
import { Color } from '@mcro/css'

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

const inlineStyle = {
  display: 'inline',
}

const dimmedStyle = {
  opacity: 0.2,
  // pointerEvents: 'none',
}

const dimStyle = {
  opacity: 0.5,
  '&:hover': {
    opacity: 1,
  },
}

const spacedStyles = {
  margin: [0, 5],
  borderRightWidth: 1,
}

// fontFamily: inherit on both fixes noElement elements
const SurfaceFrame = view(View, {
  fontFamily: 'inherit',
  position: 'relative',
})

SurfaceFrame.theme = props => {
  const theme = props.theme
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
  // if (uiContext && uiContext.inSegment && !props.ignoreSegment) {
  //   borderRadius.borderLeftRadius = uiContext.inSegment.first ? radius : 0
  //   borderRadius.borderRightRadius = uiContext.inSegment.last ? radius : 0
  // } else
  if (props.circular) {
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
    ...baseIconStyle,
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
          userActiveStyle['&:hover'] || userActiveStyle || activeStyle || {},
      }
    }
  }
  const chromelessStyle = props.chromeless && {
    borderWidth: 0,
    background: 'transparent',
  }
  const focusable = props.focusable
  const focusStyle = !props.chromeless &&
    theme.focus && {
      ...theme.focus,
      boxShadow: [...boxShadow, [0, 0, 0, 4, $(theme.focus.color).alpha(0.05)]],
    }
  let surfaceStyles = {
    ...(props.inline && inlineStyle),
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
    justifyContent: props.justify || props.justifyContent,
    alignItems: props.align || props.alignItems,
    alignSelf: props.alignSelf,
    ...borderRadius,
    borderStyle: props.borderStyle || props.borderWidth ? 'solid' : undefined,
    ...circularStyles,
    '& > div > .icon': iconStyle,
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
    ...(props.dimmed && dimmedStyle),
    ...(props.dim && dimStyle),
    ...(props.spaced && spacedStyle),
    ...chromelessStyle,
    ...(props.active && activeStyle),
    // // so you can override
    // ...props.style,
  }
  if (props.sizeLineHeight) {
    surfaceStyles.lineHeight = `${surfaceStyles.height}px`
  }
  return surfaceStyles
}

const Element = view({
  fontFamily: 'inherit',
  border: 'none',
  background: 'transparent',
  height: '100%',
  color: 'inherit',
  // this seems to maybe fix some line height stuff
  transform: {
    y: '1%',
  },
})

Element.theme = props => {
  const iconSize =
    props.iconSize ||
    Math.round(size * ICON_SCALE * (props.sizeIcon || 1) * 100) / 100
  const flexFlow = props.flexFlow || 'row'
  const iconNegativePad = props.icon ? `- ${iconSize + props.iconPad}px` : ''
  let elementGlowProps
  if (props.glow) {
    elementGlowProps = {
      position: 'relative',
      zIndex: 1,
    }
  }
  // element styles
  const element = {
    ...(props.inline && inlineStyle),
    // this fixes inputs but may break other things, need to test
    height,
    ...borderRadius,
    ...elementGlowProps,
    flexFlow,
    lineHeight: 'inherit',
    maxWidth: `calc(100% ${iconNegativePad})`,
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
  return element
}

const baseIconStyle = {
  pointerEvents: 'none',
  justifyContent: 'center',
  height: '1.4rem',
  transform: `translateY(1%)`,
}

const Wrap = view({
  flex: 1,
  overflow: 'hidden',
})

const WrapContents = view({
  flex: 1,
  position: 'relative',
  overflow: 'hidden',
})

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

// const undoPadding = {
//   margin: padding
//     ? typeof padding === 'number'
//       ? -padding
//       : padding.map(x => -x)
//     : 0,
//   padding,
// }

// const styles = {
//   wrap: undoPadding,
//   wrapContents: undoPadding,
//   after: {
//     marginTop: padding
//       ? Array.isArray(padding)
//         ? padding[0]
//         : padding
//       : 0,
//   },
// }

@attachTheme
@view.ui
class SurfaceInner extends React.Component<SurfaceProps> {
  static defaultProps = {
    iconPad: 8,
  }

  static contextTypes = {
    provided: object,
  }

  uniq = `SRFC-${Math.round(Math.random() * 100000000)}`

  render() {
    const {
      borderLeftRadius: _borderLeftRadius,
      borderRightRadius: _borderRightRadius,
      glint,
      badge,
      badgeProps,
      icon,
      iconAfter,
      iconProps,
      glow,
      dimmed,
      disabled,
      glowProps,
      noElement,
      noWrap,
      children,
      wrapElement,
      elementProps,
      tooltip,
      tooltipProps,
      className,
      after,
      ...props
    } = this.props
    const stringIcon = typeof icon === 'string'
    const passProps = {
      tagName: props.tagName,
      ref: props.forwardRef,
      style: props.style,
      ...props,
    }

    // get border radius
    let borderLeftRadius =
      typeof _borderLeftRadius === 'number'
        ? _borderLeftRadius
        : borderRadius.borderLeftRadius
    let borderRightRadius =
      typeof _borderRightRadius === 'number'
        ? _borderRightRadius
        : borderRadius.borderRightRadius
    if (typeof borderLeftRadius === 'undefined') {
      borderLeftRadius = radius
      borderRightRadius = radius
    }

    const glowColor = (props.theme && props.color) || DEFAULT_GLOW_COLOR

    const contents = (
      <>
        <Glint
          if={glint}
          key={0}
          size={size}
          borderLeftRadius={borderLeftRadius - 1}
          borderRightRadius={borderRightRadius - 1}
        />
        {badge ? (
          <Badge {...badgeProps}>
            {typeof badge !== 'boolean' ? badge : ''}
          </Badge>
        ) : null}
        {icon && !stringIcon ? <div>{icon}</div> : null}
        {icon && stringIcon ? (
          <Icon
            style={{
              order: icon && iconAfter ? 3 : 'auto',
            }}
            name={`${icon}`}
            size={iconSize}
            {...iconProps}
          />
        ) : null}
        {glow && !dimmed && !disabled ? (
          <HoverGlow
            if={}
            full
            scale={1.1}
            show={hovered}
            color={glowColor}
            opacity={0.35}
            borderLeftRadius={borderLeftRadius - 1}
            borderRightRadius={borderRightRadius - 1}
            {...glowProps}
          />
        ) : null}
        {!noElement || (noElement && !noWrap && hasChildren(children)) ? (
          <Element
            {...wrapElement && passProps}
            {...elementProps}
            disabled={disabled}
          >
            {children}
          </Element>
        ) : null}
        {noElement && noWrap && hasChildren(children) && children}
        {tooltip ? (
          <Theme name="dark">
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
              <span style={{ maxWidth: 200 }}>{tooltip}</span>
            </Popover>
          </Theme>
        ) : null}
      </>
    )
    return (
      <SurfaceFrame
        className={`${this.uniq} ${className || ''}`}
        {...!wrapElement && passProps}
      >
        {after ? (
          <Wrap>
            <WrapContents>{contents}</WrapContents>
            {after}
          </Wrap>
        ) : null}
        {!after && contents}
      </SurfaceFrame>
    )
  }
}

export const Surface = React.forwardRef((props, ref) => (
  <SurfaceInner {...props} forwardRef={ref} />
))
