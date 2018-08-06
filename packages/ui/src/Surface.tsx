import * as React from 'react'
import {
  Theme,
  Color,
  CSSPropertySet,
  propsToThemeStyles,
  propsToStyles,
  alphaColor,
} from '@mcro/gloss'
import { view, attachTheme } from '@mcro/black'
import { Icon } from './Icon'
import { HoverGlow } from './effects/HoverGlow'
import { Glint } from './effects/Glint'
import { Popover } from './Popover'
import { object } from 'prop-types'
import { Badge } from './Badge'
import { View } from './blocks/View'
import { propsToTextSize } from './helpers/propsToTextSize'

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
  tagName?: string
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
  themeAdjust?: Function
}

const getIconSize = props => {
  return (
    props.iconSize ||
    Math.round(
      (props.size || 1) *
        (props.height ? props.height / 3 : 12) *
        (props.sizeIcon || 1) *
        100,
    ) / 100
  )
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

// fontFamily: inherit on both fixes elements
const SurfaceFrame = view(View, {
  flexFlow: 'row',
  alignItems: 'center',
  fontFamily: 'inherit',
  position: 'relative',
})

SurfaceFrame.theme = props => {
  const themeStyles = propsToThemeStyles(props, true)
  // circular
  const circularStyles = props.circular && {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    width: props.height,
  }
  // icon
  const iconStyle = {
    ...baseIconStyle,
  }
  const hoverIconStyle = {
    color: props.iconHoverColor || themeStyles.hoverColor,
  }
  const chromelessStyle = props.chromeless && {
    borderColor: 'transparent',
    background: 'transparent',
  }
  let surfaceStyles = {
    color: props.color || props.theme.base.color,
    ...(props.inline && inlineStyle),
    overflow:
      props.overflow || props.glow
        ? props.overflow || 'hidden'
        : props.overflow,
    justifyContent: props.justify || props.justifyContent,
    alignSelf: props.alignSelf,
    borderStyle: props.borderStyle || props.borderWidth ? 'solid' : undefined,
    ...circularStyles,
    '& > div > .icon': iconStyle,
    '&:hover > div > .icon': hoverIconStyle,
    ...(props.dimmed && dimmedStyle),
    ...(props.dim && dimStyle),
    ...props.userStyle,
    ...themeStyles,
    ...propsToStyles(props),
    ...propsToTextSize(props),
    ...(props.active && themeStyles['&:active']),
    ...chromelessStyle,
  }
  return alphaColor(surfaceStyles, props.alpha)
}

const Element = view({
  // needed to reset for <button /> at least
  fontSize: 'inherit',
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
    ...props,
    ...(props.inline && inlineStyle),
    width: `calc(100% ${iconNegativePad})`,
    ...elementStyle,
  }
}

const baseIconStyle = {
  pointerEvents: 'none',
  justifyContent: 'center',
}

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
      themeAdjust,
      style,
      padding,
      margin,
      className,
      ...props
    } = this.props
    const adjustedTheme = themeAdjust ? themeAdjust(theme) : theme
    const stringIcon = typeof icon === 'string'
    // goes to both
    const throughProps = {
      theme: adjustedTheme,
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
      throughProps.lineHeight = `${height + 1}px`
    }
    return (
      <SurfaceFrame
        whiteSpace="pre"
        padding={padding}
        margin={margin}
        {...throughProps}
        {...props}
        forwardRef={forwardRef}
        userStyle={style}
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
