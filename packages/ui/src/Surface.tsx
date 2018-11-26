import * as React from 'react'
import {
  Color,
  CSSPropertySet,
  propsToThemeStyles,
  propsToStyles,
  alphaColor,
  ThemeObject,
} from '@mcro/gloss'
import { view } from '@mcro/black'
import { attachTheme } from '@mcro/gloss'
import { Icon } from './Icon'
import { HoverGlow } from './effects/HoverGlow'
import { Glint } from './effects/Glint'
import { View } from './blocks/View'
import { propsToTextSize } from './helpers/propsToTextSize'
import { UIContext, UIContextType } from './helpers/contexts'
import { Tooltip } from './Tooltip'
import { selectThemeSubset } from './helpers/selectThemeSubset'

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
  theme?: ThemeObject
  tooltip?: string
  tooltipProps?: Object
  uiContext?: UIContextType
  width?: number | string
  alpha?: number
  alphaHover?: number
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
  themeSelect?: ((theme: ThemeObject) => ThemeObject) | string
}

const getIconSize = props => {
  return (
    props.iconSize ||
    Math.round((props.size || 1) * (props.height ? props.height / 3 : 12) * (props.sizeIcon || 1))
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

const chromelessStyle = {
  borderColor: 'transparent',
  background: 'transparent',
}

const getSegmentRadius = props => {
  // support being inside a segmented list
  let segmentedStyle: any
  if (!props.ignoreSegment) {
    if (props.uiContext && props.uiContext.inSegment) {
      const { inSegment } = props.uiContext
      segmentedStyle = {
        borderRightRadius: props.borderRadius,
        borderLeftRadius: props.borderRadius,
      }
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
  return segmentedStyle
}

// fontFamily: inherit on both fixes elements
const SurfaceFrame = view(View, {
  fontFamily: 'inherit',
  position: 'relative',
}).theme(props => {
  // :hover, :focus, :active
  const { themeStyles, themeStylesFromProps } = propsToThemeStyles(props, true)
  const propStyles = propsToStyles(props)
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
  const hoverStyle = props.active
    ? null
    : {
        ...themeStyles['&:hover'],
        ...propStyles['&:hover'],
        // @ts-ignore
        ...(themeStylesFromProps && themeStylesFromProps['&:hover']),
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
    '& > div > .icon': iconStyle,
    '&:hover > div > .icon': hoverIconStyle,
    ...(props.dimmed && dimmedStyle),
    ...(props.dim && dimStyle),
    ...props.userStyle,
    // note: base theme styles go *above* propsToStyles...
    ...(!props.chromeless && themeStyles),
    ...propStyles,
    // ...whereas theme styles passed in as ovverrides go in here
    ...themeStylesFromProps,
    ...(!props.chromeless &&
      props.active && { '&:hover': props.activeHoverStyle || themeStyles['&:active'] }),
    ...propsToTextSize(props),
    ...(props.chromeless && chromelessStyle),
    ...props.segmentedStyle,
    ...circularStyles,
    '&:hover': hoverStyle,
  }
  return alphaColor(surfaceStyles, { alpha: props.alpha, alphaHover: props.alphaHover })
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
    overflow: 'hidden',
    ...props,
    ...(props.inline && inlineStyle),
    ...(props.ellipse && {
      textOverflow: 'ellipse',
      whiteSpace: 'nowrap',
    }),
    width: props.width || `calc(100% ${iconNegativePad})`,
    ...elementStyle,
  }
})

const baseIconStyle = {
  pointerEvents: 'none',
  justifyContent: 'center',
}

@attachTheme
export class SurfaceInner extends React.Component<SurfaceProps> {
  static defaultProps = {
    iconPad: 8,
    size: 1,
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
      alignItems,
      justifyContent,
      ...props
    } = this.props
    const segmentedStyle = getSegmentRadius(this.props)

    // allow selecting subsets of the theme object
    let selectedTheme = theme
    if (themeSelect) {
      if (typeof themeSelect === 'string') {
        selectedTheme = selectThemeSubset(themeSelect, theme)
      } else {
        selectedTheme = themeSelect(theme)
      }
    }

    const stringIcon = typeof icon === 'string'

    // goes to BOTH the outer element and inner element
    const throughProps = {
      alignItems,
      justifyContent,
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
      overflow: this.props.overflow,
    } as Partial<SurfaceProps>

    if (sizeLineHeight) {
      throughProps.lineHeight = `${height}px`
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
        segmentedStyle={segmentedStyle}
      >
        {noInnerElement ? (
          children
        ) : (
          <>
            {glint && !props.chromeless ? (
              <Glint
                key={0}
                size={size}
                opacity={0.2}
                debug={this.props.debug}
                borderLeftRadius={
                  segmentedStyle ? segmentedStyle.borderLeftRadius : props.borderRadius
                }
                borderRightRadius={
                  segmentedStyle ? segmentedStyle.borderRightRadius : props.borderRadius
                }
              />
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
              <Tooltip key={this.uniq} target={`.${this.uniq}`} {...tooltipProps}>
                {tooltip}
              </Tooltip>
            )}
          </>
        )}
      </SurfaceFrame>
    )
  }
}

export const Surface = React.memo(props => (
  <UIContext.Consumer>
    {uiContext => <SurfaceInner uiContext={uiContext} {...props} />}
  </UIContext.Consumer>
))
