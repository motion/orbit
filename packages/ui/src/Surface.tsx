import { CSSPropertySetStrict } from '@mcro/css'
import {
  alphaColor,
  Color,
  gloss,
  propsToStyles,
  propsToTextSize,
  propsToThemeStyles,
  selectThemeSubset,
  ThemeObject,
  ThemeSelect,
  View,
} from '@mcro/gloss'
import * as React from 'react'
import { BreadcrumbReset, useBreadcrumb } from './Breadcrumbs'
import { Glint } from './effects/Glint'
import { HoverGlow } from './effects/HoverGlow'
import { configure } from './helpers/configure'
import { Icon as UIIcon } from './Icon'
import { PopoverProps } from './Popover'
import { getSegmentRadius } from './SegmentedRow'
import { Tooltip } from './Tooltip'

// an element for creating surfaces that look like buttons
// they basically can control a prefix/postfix icon, and a few other bells

export type SurfaceProps = CSSPropertySetStrict & {
  hover?: boolean
  hoverStyle?: any
  active?: boolean
  activeStyle?: any
  ellipse?: boolean
  borderRadius?: number
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
  tooltipProps?: PopoverProps
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
  sizeLineHeight?: boolean | number
  type?: string
  themeSelect?: ThemeSelect
  iconPad?: number
}

export const Surface = React.memo(function Surface(props: SurfaceProps) {
  const crumb = useBreadcrumb()
  const [tooltipState, setTooltipState] = React.useState({ id: null, show: false })

  React.useEffect(() => {
    const id = `Surface-${Math.round(Math.random() * 100000000)}`
    setTooltipState({ id, show: false })
    let tm = setTimeout(() => {
      setTooltipState({ id, show: true })
    })
    return () => clearTimeout(tm)
  }, [])

  const {
    size = 1,
    iconPad = 8,
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
    sizeLineHeight,
    noInnerElement,
    tagName,
    themeSelect,
    className,
    alignItems,
    justifyContent,
    forwardRef,
    ...rest
  } = props

  const Icon = configure.useIcon || UIIcon
  const segmentedStyle = getSegmentRadius(props, crumb)

  const stringIcon = typeof icon === 'string'

  // goes to BOTH the outer element and inner element
  const throughProps = {
    height,
    iconPad,
    alignItems,
    justifyContent,
    sizeIcon: props.sizeIcon,
    iconSize: props.iconSize,
    iconAfter: props.iconAfter,
    inline: props.inline,
    icon: props.icon,
    fontWeight: props.fontWeight,
    ellipse: props.ellipse,
    overflow: props.overflow,
  } as Partial<SurfaceProps>

  let lineHeight = props.lineHeight
  if (sizeLineHeight) {
    lineHeight = `${height}px`
  }

  if (noInnerElement) {
    throughProps.tagName = tagName
  }

  const surfaceProps = {
    whiteSpace: 'pre',
    segmentedStyle,
    lineHeight,
    ...throughProps,
    ...rest,
    className: `${tooltipState.id} ${className || ''}`,
  }

  // because we can't define children at all on tags like input
  // we conditionally set children here to avoid having children: undefined
  if (noInnerElement) {
    if (children) {
      surfaceProps.children = children
    }
  } else {
    surfaceProps.children = (
      <>
        {!!tooltip && tooltipState.show && (
          <Tooltip label={tooltip} {...tooltipProps}>
            {`.${tooltipState.id}`}
          </Tooltip>
        )}
        {glint && !props.chromeless && (
          <Glint
            key={0}
            borderLeftRadius={
              (segmentedStyle ? segmentedStyle.borderLeftRadius : props.borderRadius) - 1
            }
            borderRightRadius={
              (segmentedStyle ? segmentedStyle.borderRightRadius : props.borderRadius) - 1
            }
          />
        )}
        <div style={{ opacity: typeof props.alpha === 'number' ? props.alpha : 1 }}>
          {icon && !stringIcon && <div>{icon}</div>}
          {icon && stringIcon && (
            <Icon
              order={icon && iconAfter ? 3 : 'auto'}
              name={`${icon}`}
              size={getIconSize(props)}
              {...iconProps}
            />
          )}
        </div>
        {glow && !dimmed && !disabled && (
          <HoverGlow
            full
            scale={1.1}
            opacity={0.35}
            borderRadius={+props.borderRadius}
            {...glowProps}
          />
        )}
        {!!children && (
          <Element {...throughProps} {...elementProps} disabled={disabled} tagName={tagName}>
            {children}
          </Element>
        )}
      </>
    )
  }

  return (
    <BreadcrumbReset>
      <SurfaceFrame
        ref={forwardRef}
        themeSelect={themeSelect}
        {...surfaceProps}
        opacity={crumb && crumb.total === 0 ? 0 : surfaceProps.opacity || 1}
      />
    </BreadcrumbReset>
  )
})

// fontFamily: inherit on both fixes elements
const SurfaceFrame = gloss(View, {
  fontFamily: 'inherit',
  position: 'relative',
}).theme((props, baseTheme) => {
  // select theme
  const theme = selectThemeSubset(props.themeSelect, baseTheme)

  // :hover, :focus, :active
  const themeStyles = propsToThemeStyles(props, theme, true)
  const propStyles = propsToStyles(props, theme)

  // circular
  const circularStyles = props.circular && {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    width: props.height,
  }

  // icon
  const hoverIconStyle = {
    color: props.iconHoverColor || themeStyles.colorHover,
  }

  const hoverStyle = props.active
    ? null
    : {
        ...(!props.chromeless && themeStyles['&:hover']),
        ...propStyles['&:hover'],
      }

  return alphaColor(
    {
      padding: props.padding,
      margin: props.margin,
      fontWeight: props.fontWeight,
      color: props.color || theme.color,
      ...(props.inline && {
        display: 'inline',
      }),
      boxShadow: props.boxShadow || getSurfaceShadow(props.elevation),
      overflow: props.overflow || props.glow ? props.overflow || 'hidden' : props.overflow,
      justifyContent: props.justify || props.justifyContent,
      alignSelf: props.alignSelf,
      borderStyle:
        props.borderStyle || props.borderWidth ? props.borderStyle || 'solid' : undefined,
      '& > div > .icon': {
        pointerEvents: 'none',
        justifyContent: 'center',
      },
      '&:hover > div > .icon': hoverIconStyle,
      ...(props.dimmed && {
        opacity: 0.2,
      }),
      ...props.style,
      // note: base theme styles go *above* propsToStyles...
      ...(!props.chromeless && themeStyles),
      ...propStyles,
      ...(!props.chromeless &&
        props.active && { '&:hover': props.activeHoverStyle || themeStyles['&:active'] }),
      ...propsToTextSize(props),
      ...(props.chromeless && {
        borderColor: 'transparent',
        background: 'transparent',
      }),
      ...props.segmentedStyle,
      ...circularStyles,
      '&:hover': hoverStyle,
    },
    { alpha: props.alpha, alphaHover: props.alphaHover },
  )
})

const ellipseStyle = {
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

const Element = gloss({
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
  transform: {
    y: 0.5,
  },
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
    ...(props.inline && {
      display: 'inline',
    }),
    ...(props.ellipse && ellipseStyle),
    width: props.width || `calc(100% ${iconNegativePad})`,
    ...elementStyle,
  }
})

const getIconSize = (props: SurfaceProps) => {
  const size = (props.size || 1) * (props.height ? props.height / 3 : 12) * (props.sizeIcon || 1)
  return props.iconSize || Math.round(size * 100) / 100
}

const round = (x: number) => Math.round(x * 4) / 4
const smoother = (base: number, amt: number) => round((Math.log(Math.max(1, base + 0.2)) + 1) * amt)
const elevatedShadow = (x: number) => [
  0,
  smoother(x, 3),
  smoother(x, 17),
  [0, 0, 0, round(0.12 * smoother(x, 1))],
]

export function getSurfaceShadow(elevation: number) {
  if (!elevation) {
    return null
  }
  return [elevatedShadow(elevation) as any]
}
