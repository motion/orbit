import * as React from 'react'
import {
  Theme,
  Color,
  CSSPropertySet,
  propsToThemeStyles,
  propsToStyles,
} from '@mcro/gloss'
import { view, attachTheme } from '@mcro/black'
import toColor from '@mcro/color'
import { Icon } from './Icon'
import { HoverGlow } from './effects/HoverGlow'
import { Glint } from './effects/Glint'
import { Popover } from './Popover'
import { object } from 'prop-types'
import { Badge } from './Badge'
import { View } from './blocks/View'

const POPOVER_PROPS = { style: { fontSize: 12 } }

export type SurfaceProps = CSSPropertySet & {
  active?: boolean
  after?: React.ReactNode
  background?: Color
  badge?: React.ReactNode
  badgeProps?: Object
  children?: React.ReactNode
  name?: string
  chromeless?: boolean
  circular?: boolean
  className?: string
  clickable?: boolean
  dim?: boolean
  elementProps?: Object
  elevation?: number
  flex?: boolean | number
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
  noInnerElement?: boolean
  onClick?: Function
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
  alpha?: number
  dimmed?: boolean
  disabled?: boolean
  placeholderColor?: Color
  highlightBackground?: Color
  highlightColor?: Color
  style?: Object
  ignoreSegment?: boolean
  activeStyle?: Object
  sizeLineHeight?: boolean | number
  type?: string
}

const getIconSize = props =>
  props.iconSize ||
  Math.round(
    props.size *
      (props.height ? props.height / 3 : 12) *
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

const SurfaceBase = view({})
SurfaceBase.theme = props => ({
  ...propsToThemeStyles(props),
  ...propsToStyles(props),
})

// fontFamily: inherit on both fixes elements
const SurfaceFrame = view(SurfaceBase, {
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
      : toColor(
          props.color ||
            (props.highlight && props.highlightColor) ||
            theme[STATE].color,
        )
  if (typeof props.alpha === 'number' && typeof color !== 'string') {
    color = `${color.alpha(props.alpha)}`
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
    background = toColor(background)
  }
  if (typeof props.backgroundAlpha === 'number' && background.alpha) {
    background = background.alpha(props.backgroundAlpha)
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
    alignItems: 'center',
    justifyContent: 'center',
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
    '&:active': activeStyle,
    ...(props.dimmed && dimmedStyle),
    ...(props.dim && dimStyle),
    ...chromelessStyle,
    ...(props.active && activeStyle),
    // // so you can override
    // ...props.style,
  }
  return surfaceStyles
}

const Element = view(View, {
  // needed to reset for <button /> at least
  padding: 0,
  flexFlow: 'row',
  fontFamily: 'inherit',
  border: 'none',
  background: 'transparent',
  height: '100%',
  lineHeight: 'inherit',
  color: 'inherit',
  noInnerElement: {
    display: 'none',
  },
})

Element.theme = props => {
  const iconSize = getIconSize(props)
  const iconNegativePad = props.icon ? `- ${iconSize + props.iconPad}px` : ''
  // element styles
  const elementStyle = {
    marginLeft: 0,
    marginRight: 0,
  }
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

const DEFAULT_GLOW_COLOR = [255, 255, 255]

@attachTheme
@view.ui
export class Surface extends React.Component<SurfaceProps> {
  static defaultProps = {
    iconPad: 8,
    size: 1,
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
      children,
      elementProps,
      tooltip,
      tooltipProps,
      height,
      color,
      theme,
      size,
      sizeLineHeight,
      noInnerElement,
      tagName,
      forwardRef,
      style,
      padding,
      margin,
      className,
      ...props
    } = this.props
    const stringIcon = typeof icon === 'string'
    // goes to both
    const throughProps = {
      sizeIcon: this.props.sizeIcon,
      iconSize: this.props.iconSize,
      height: this.props.height,
      iconAfter: this.props.iconAfter,
      iconPad: this.props.iconPad,
      inline: this.props.inline,
      icon: this.props.icon,
      lineHeight: this.props.lineHeight,
    }
    if (sizeLineHeight) {
      throughProps.lineHeight = `${height + 0.5}px`
    }
    const glowColor = (theme && color) || DEFAULT_GLOW_COLOR
    return (
      <SurfaceFrame
        whiteSpace="pre"
        padding={padding}
        margin={margin}
        {...throughProps}
        {...props}
        forwardRef={forwardRef}
        style={style}
        className={`${this.uniq} ${className || ''}`}
      >
        {glint ? (
          <Glint key={0} size={size} borderRadius={props.borderRadius} />
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
            borderRadius={props.borderRadius}
            {...glowProps}
          />
        ) : null}
        {!noInnerElement &&
          !!children && (
            <Element
              tagName={tagName}
              {...throughProps}
              {...elementProps}
              disabled={disabled}
            >
              {children}
            </Element>
          )}
        {tooltip ? (
          <Theme name="dark">
            <Popover
              background
              openOnHover
              closeOnClick
              noHoverOnChildren
              animation="bounce 150ms"
              target={`.${this.uniq}`}
              padding={[2, 7]}
              borderRadius={5}
              distance={12}
              forgiveness={8}
              arrowSize={10}
              delay={400}
              popoverProps={POPOVER_PROPS}
              {...tooltipProps}
            >
              {tooltip}
            </Popover>
          </Theme>
        ) : null}
      </SurfaceFrame>
    )
  }
}
