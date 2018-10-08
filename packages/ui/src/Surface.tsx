import * as React from 'react'
import { Color, CSSPropertySet, propsToThemeStyles, propsToStyles, alphaColor } from '@mcro/gloss'
import { view } from '@mcro/black'
import { attachTheme } from '@mcro/gloss'
import { Icon } from './Icon'
import { HoverGlow } from './effects/HoverGlow'
import { Glint } from './effects/Glint'
import { object } from 'prop-types'
import { View } from './blocks/View'
import { propsToTextSize } from './helpers/propsToTextSize'
import { UIContext } from './helpers/contexts'
import { Tooltip } from './Tooltip'

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
  onClick?: any
  size?: number
  sizeIcon?: number
  spaced?: boolean
  stretch?: boolean
  tagName?: string
  theme?: string
  tooltip?: string
  tooltipProps?: Object
  uiContext?: { inSegment?: { first: boolean; last: boolean; index: number } }
  width?: number | string
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
  themeSelect?: Function
}

const getIconSize = props => {
  return (
    props.iconSize ||
    Math.round(
      (props.size || 1) * (props.height ? props.height / 3 : 12) * (props.sizeIcon || 1) * 100,
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
}).theme(props => {
  const { themeStyles, themeStylesFromProps } = propsToThemeStyles(props, true)
  // support being inside a segmented list
  let segmentedStyle: any
  if (!props.ignoreSegment) {
    if (props.uiContext && props.uiContext.inSegment) {
      const { inSegment } = props.uiContext
      segmentedStyle = {}
      if (inSegment.first) {
        segmentedStyle.borderRightRadius = 0
        segmentedStyle.borderRightWidth = 0
      } else if (inSegment.last) {
        segmentedStyle.borderLeftRadius = 0
      } else {
        segmentedStyle.borderRightRadius = 0
        segmentedStyle.borderRightWidth = 0
        segmentedStyle.borderLeftRadius = 0
      }
    }
  }
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
    color: props.iconHoverColor || themeStyles.colorHover,
  }
  const chromelessStyle = props.chromeless && {
    borderColor: 'transparent',
    background: 'transparent',
  }
  let surfaceStyles = {
    padding: props.padding,
    margin: props.margin,
    fontWeight: props.fontWeight,
    color: props.color || props.theme.color,
    ...(props.inline && inlineStyle),
    overflow: props.overflow || props.glow ? props.overflow || 'hidden' : props.overflow,
    justifyContent: props.justify || props.justifyContent,
    alignSelf: props.alignSelf,
    borderStyle: props.borderStyle || props.borderWidth ? props.borderStyle || 'solid' : undefined,
    ...circularStyles,
    '& > div > .icon': iconStyle,
    '&:hover > div > .icon': hoverIconStyle,
    ...(props.dimmed && dimmedStyle),
    ...(props.dim && dimStyle),
    ...props.userStyle,
    // note: base theme styles go *above* propsToStyles...
    ...themeStyles,
    ...propsToStyles(props),
    // ...whereas theme styles passed in as ovverrides go in here
    ...themeStylesFromProps,
    ...(props.active && { '&:hover': themeStyles['&:active'] }),
    ...propsToTextSize(props),
    ...chromelessStyle,
    ...segmentedStyle,
  }
  return alphaColor(surfaceStyles, props.alpha)
})

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
  overflow: 'hidden',
  noInnerElement: {
    display: 'none',
  },
}).theme(props => {
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
    ...(props.ellipse && {
      textOverflow: 'ellipse',
      whiteSpace: 'nowrap',
    }),
    width: `calc(100% ${iconNegativePad})`,
    ...elementStyle,
  }
})

const baseIconStyle = {
  pointerEvents: 'none',
  justifyContent: 'center',
}

// @ts-ignore
@attachTheme
@view.ui
export class SurfaceInner extends React.Component<SurfaceProps> {
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
      themeSelect,
      style,
      padding,
      margin,
      className,
      ...props
    } = this.props
    const selectedTheme = themeSelect ? themeSelect(theme) : theme
    const stringIcon = typeof icon === 'string'
    // goes to both
    const throughProps = {
      theme: selectedTheme,
      sizeIcon: this.props.sizeIcon,
      iconSize: this.props.iconSize,
      height: this.props.height,
      iconAfter: this.props.iconAfter,
      iconPad: this.props.iconPad,
      inline: this.props.inline,
      icon: this.props.icon,
      lineHeight: this.props.lineHeight,
      fontWeight: this.props.fontWeight,
      ellipse: this.props.ellipse,
    } as Partial<SurfaceProps>
    if (sizeLineHeight) {
      throughProps.lineHeight = `${height + 1}px`
    }
    if (noInnerElement) {
      throughProps.tagName = tagName
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
        {noInnerElement ? null : (
          <>
            {glint ? (
              <Glint key={0} size={size} opacity={0.2} borderRadius={props.borderRadius} />
            ) : null}
            {icon && !stringIcon ? <div>{icon}</div> : null}
            {icon && stringIcon ? (
              <Icon
                // @ts-ignore
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
                borderRadius={+props.borderRadius}
                {...glowProps}
              />
            ) : null}
            {!!children && (
              <Element {...throughProps} {...elementProps} disabled={disabled} tagName={tagName}>
                {children}
              </Element>
            )}
            {!!tooltip && (
              <Tooltip target={`.${this.uniq}`} {...tooltipProps}>
                {tooltip}
              </Tooltip>
            )}
          </>
        )}
      </SurfaceFrame>
    )
  }
}

export const Surface = props => (
  <UIContext.Consumer>
    {uiContext => <SurfaceInner uiContext={uiContext} {...props} />}
  </UIContext.Consumer>
)
