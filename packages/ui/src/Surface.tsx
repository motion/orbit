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
import { propsToThemeStyles } from '@mcro/gloss'

const POPOVER_PROPS = { style: { fontSize: 12 } }

export type SurfaceProps = {
  active?: boolean
  after?: React.ReactNode
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
  icon?: React.ReactNode
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
  vertical?: boolean
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

const getIconSize = props =>
  props.iconSize ||
  Math.round(
    props.size *
      (props.height ? props.height / 3.5 : 12) *
      (props.sizeIcon || 1) *
      100,
  ) / 100

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

// fontFamily: inherit on both fixes noElement elements
const SurfaceFrame = view(View, {
  flexFlow: 'row',
  alignItems: 'center',
  fontFamily: 'inherit',
  position: 'relative',
})

SurfaceFrame.theme = props => {
  const theme = props.theme
  const propStyles = propsToThemeStyles(props)
  // sizes
  const height = props.height
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
    color: props.iconHoverColor || propStyles.hoverColor,
  }
  // state styles
  const hoverStyle = (props.hover ||
    (!props.chromeless && !props.disabled && props.hoverable)) && {
    ...theme.hover,
    color: propStyles.hoverColor,
    borderColor: propStyles.hoverBorderColor,
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
    background,
    boxShadow,
    justifyContent: props.justify || props.justifyContent,
    alignSelf: props.alignSelf,
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

const Element = view(View, {
  flexFlow: 'row',
  fontFamily: 'inherit',
  border: 'none',
  background: 'transparent',
  height: '100%',
  lineHeight: 'inherit',
  color: 'inherit',
  // this seems to maybe fix some line height stuff
  transform: {
    y: '1%',
  },
})

Element.theme = props => {
  const iconSize = getIconSize(props)
  const iconNegativePad = props.icon ? `- ${iconSize + props.iconPad}px` : ''
  // element styles
  const elementStyle = {}
  // spacing between icon
  const hasIconBefore = !!props.icon && !props.iconAfter
  const hasIconAfter = !!props.icon && props.iconAfter
  if (hasIconBefore) {
    elementStyle.marginLeft = props.iconPad
  }
  if (hasIconAfter) {
    elementStyle.marginRight = props.iconPad
  }
  return {
    ...(props.inline && inlineStyle),
    width: `calc(100% ${iconNegativePad})`,
    ...elementStyle,
  }
}

const baseIconStyle = {
  pointerEvents: 'none',
  justifyContent: 'center',
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

  uniq = `SRFC-${Math.round(Math.random() * 100000000)}`

  render() {
    const {
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
      // wrapElement,
      elementProps,
      tooltip,
      tooltipProps,
      after,
      color,
      theme,
      size,
    } = this.props
    const stringIcon = typeof icon === 'string'
    const {
      tagName,
      forwardRef,
      style,
      padding,
      className,
      ...throughProps
    } = this.props
    const glowColor = (theme && color) || DEFAULT_GLOW_COLOR
    return (
      <SurfaceFrame
        alignSelf="flex-start"
        whiteSpace="pre"
        padding={padding}
        {...throughProps}
        forwardRef={forwardRef}
        style={style}
        className={`${this.uniq} ${className || ''}`}
      >
        {glint ? (
          <Glint
            key={0}
            size={size}
            // borderLeftRadius={borderLeftRadius - 1}
            // borderRightRadius={borderRightRadius - 1}
          />
        ) : null}
        {badge ? (
          <Badge {...badgeProps}>
            {typeof badge !== 'boolean' ? badge : ''}
          </Badge>
        ) : null}
        {icon && !stringIcon ? <div>{icon}</div> : null}
        {icon && stringIcon ? (
          <Icon
            order={icon && iconAfter ? 3 : 'auto'}
            name={`${icon}`}
            size={getIconSize(this.props)}
            {...iconProps}
          />
        ) : null}
        {glow && !dimmed && !disabled ? (
          <HoverGlow
            full
            scale={1.1}
            color={`${glowColor}`}
            opacity={0.35}
            // borderLeftRadius={borderLeftRadius - 1}
            // borderRightRadius={borderRightRadius - 1}
            {...glowProps}
          />
        ) : null}
        <Element
          minWidth={
            Array.isArray(this.props.padding)
              ? this.props.padding[1] * 5
              : 'auto'
          }
          tagName={tagName}
          {...throughProps}
          {...elementProps}
          disabled={disabled}
        >
          {children}
        </Element>
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
      </SurfaceFrame>
    )
  }
}

export const Surface = React.forwardRef((props, ref) => (
  <SurfaceInner {...props} forwardRef={ref} />
))
