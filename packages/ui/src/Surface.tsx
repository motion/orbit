import { ColorLike, CSSPropertySet, px } from '@o/css'
import Gloss, {
  Col,
  forwardTheme,
  gloss,
  propsToStyles,
  psuedoStyleTheme,
  useTheme,
} from '@o/gloss'
import { isDefined, selectDefined, selectObject } from '@o/utils'
import React, { useEffect, useMemo, useState } from 'react'
import { Badge } from './Badge'
import { BreadcrumbReset, useBreadcrumb } from './Breadcrumbs'
import { Glint } from './effects/Glint'
import { HoverGlow } from './effects/HoverGlow'
import { createContextualProps } from './helpers/createContextualProps'
import { memoIsEqualDeep } from './helpers/memoHelpers'
import { Icon, IconProps, IconPropsContext } from './Icon'
import { PassProps } from './PassProps'
import { PopoverProps } from './Popover'
import { getSegmentedStyle } from './SegmentedRow'
import { SizedSurfaceProps } from './SizedSurface'
import { getSize } from './Sizes'
import { Sizes } from './Space'
import { Tooltip } from './Tooltip'
import { getElevation } from './View/elevate'
import { getPadding } from './View/PaddedView'
import { ViewProps } from './View/View'

// an element for creating surfaces that look like buttons
// they basically can control a prefix/postfix icon, and a few other bells

export type SurfaceSpecificProps = {
  borderPosition?: 'inside' | 'outside'
  focus?: boolean
  hover?: boolean
  active?: boolean
  ellipse?: boolean
  before?: React.ReactNode
  after?: React.ReactNode
  badge?: React.ReactNode
  badgeProps?: Object
  children?: React.ReactNode
  name?: string
  chromeless?: boolean
  circular?: boolean
  clickable?: boolean
  elementProps?: Object
  forwardRef?: React.Ref<any>
  glintBottom?: boolean
  glint?: boolean
  glow?: boolean
  glowProps?: Object
  highlight?: boolean
  hovered?: boolean
  icon?: React.ReactNode
  iconAfter?: boolean
  iconColor?: ColorLike
  iconProps?: Partial<IconProps>
  iconSize?: number
  noInnerElement?: boolean
  size?: Sizes
  sizeIcon?: number
  spaced?: boolean
  stretch?: boolean
  theme?: Gloss.ThemeObject | string
  tooltip?: React.ReactNode
  tooltipProps?: PopoverProps
  width?: number | string
  alpha?: number
  alphaHover?: number
  disabled?: boolean
  placeholderColor?: ColorLike
  highlightBackground?: ColorLike
  highlightColor?: ColorLike
  ignoreSegment?: boolean
  sizeLineHeight?: boolean | number
  type?: string
  themeSelect?: Gloss.ThemeSelect
  iconPad?: number
}

export type SurfaceProps = ViewProps & SurfaceSpecificProps

// TODO this is using SizedSurfaceProps, needs some work to separate the two
const Context = createContextualProps<SizedSurfaceProps>()
export const SurfacePassProps = Context.PassProps
export const useSurfaceProps = Context.useProps

type ThroughProps = Pick<
  SurfaceProps,
  | 'height'
  | 'iconPad'
  | 'alignItems'
  | 'justifyContent'
  | 'sizeIcon'
  | 'iconSize'
  | 'iconAfter'
  | 'fontWeight'
  | 'ellipse'
  | 'overflow'
> & {
  hasIcon: boolean
  tagName?: string
}

const iconTransform = {
  y: 0.5,
}

const acceptsIcon = child => child.type.acceptsIconProps === true

export const Surface = memoIsEqualDeep(function Surface(direct: SurfaceProps) {
  const props = Context.useProps(direct)
  const crumb = useBreadcrumb()
  const [tooltipState, setTooltipState] = useState({ id: null, show: false })
  const theme = useTheme(props)

  useEffect(() => {
    const id = `Surface-${Math.round(Math.random() * 100000000)}`
    setTooltipState({ id, show: false })
    let tm = setTimeout(() => {
      setTooltipState({ id, show: true })
    })
    return () => clearTimeout(tm)
  }, [])

  const {
    alignItems,
    children,
    className,
    disabled,
    elementProps,
    forwardRef,
    glintBottom,
    glint,
    glow,
    glowProps,
    height,
    icon,
    iconAfter,
    iconPad,
    iconProps,
    justifyContent,
    noInnerElement,
    size: ogSize,
    sizeLineHeight,
    tagName,
    themeSelect = 'surface',
    tooltip,
    tooltipProps,
    pad,
    padding,
    badgeProps,
    badge,
    after,
    borderPosition = 'outside',
    borderWidth,
    alt,
    before,
    ...viewProps
  } = props
  const size = getSize(selectDefined(ogSize, 1))
  const segmentedStyle = getSegmentedStyle(
    { borderRadius: +props.borderRadius, ignoreSegment: props.ignoreSegment },
    crumb,
  )
  const stringIcon = typeof icon === 'string'

  // goes to BOTH the outer element and inner element
  const throughProps: ThroughProps = {
    height,
    iconPad: typeof iconPad === 'number' ? iconPad : size * 10,
    alignItems,
    justifyContent,
    sizeIcon: props.sizeIcon,
    iconSize: props.iconSize,
    iconAfter: props.iconAfter,
    hasIcon: !!props.icon,
    fontWeight: props.fontWeight,
    ellipse: props.ellipse,
    overflow: props.overflow,
  }

  let lineHeight = props.lineHeight
  if (sizeLineHeight) {
    lineHeight = `${height}px`
  }

  if (noInnerElement) {
    throughProps.tagName = tagName
  }

  const childrenProps = {
    children: null,
  }

  const borderLeftRadius = Math.min(
    segmentedStyle ? segmentedStyle.borderLeftRadius : +props.borderRadius,
    +height / 2,
  )
  const borderRightRadius = Math.min(
    segmentedStyle ? segmentedStyle.borderRightRadius : +props.borderRadius,
    +height / 2,
  )

  const hasAnyGlint = !props.chromeless && isDefined(glint, glintBottom)

  // because we can't define children at all on tags like input
  // we conditionally set children here to avoid having children: undefined
  if (noInnerElement) {
    if (isDefined(before, after)) {
      childrenProps.children = (
        <>
          {before}
          {children || null}
          {after}
        </>
      )
    } else {
      childrenProps.children = children || null
    }
  } else {
    childrenProps.children = (
      <>
        {before}
        {!!badge && (
          <Badge
            zIndex={typeof props.zIndex === 'number' ? props.zIndex + 1 : 100}
            position="absolute"
            top="-20%"
            left="-20%"
            size={size}
            {...badgeProps}
          >
            {badge}
          </Badge>
        )}
        {!!tooltip && tooltipState.show && (
          <Tooltip label={tooltip} {...tooltipProps}>
            {`.${tooltipState.id}`}
          </Tooltip>
        )}
        {hasAnyGlint && (
          <GlintContain
            borderLeftRadius={borderLeftRadius + 1}
            borderRightRadius={borderRightRadius + 1}
          >
            {glint && !props.chromeless && (
              <Glint
                size={size}
                borderLeftRadius={borderLeftRadius}
                borderRightRadius={borderRightRadius}
                themeSelect={themeSelect}
              />
            )}
            {glintBottom && !props.chromeless && (
              <Glint
                size={size}
                bottom={0}
                borderLeftRadius={borderLeftRadius}
                borderRightRadius={borderRightRadius}
                themeSelect={themeSelect}
              />
            )}
          </GlintContain>
        )}
        <div
          style={{
            order: icon && iconAfter ? 3 : 'inherit',
          }}
        >
          <PassProps
            passCondition={acceptsIcon}
            alt={alt}
            size={getIconSize(props)}
            transform={iconTransform}
            opacity={selectDefined(props.alpha, props.opacity)}
            {...iconProps}
          >
            {icon && !stringIcon && icon}
            {icon && stringIcon && <Icon name={`${icon}`} />}
          </PassProps>
        </div>
        {glow && !disabled && (
          <HoverGlow
            full
            scale={1.1}
            opacity={0.35}
            borderRadius={+props.borderRadius}
            {...glowProps}
          />
        )}
        {!!children && (
          <Element
            {...throughProps}
            {...elementProps}
            surfacePadX={getPadX(getPadding(props).padding)}
            disabled={disabled}
            tagName={tagName}
          >
            {children}
          </Element>
        )}
        {after}
      </>
    )
  }

  const iconOpacity = typeof props.alpha !== 'undefined' ? +props.alpha : (props.opacity as any)
  const iconColor = `${(props.iconProps && props.iconProps.color) ||
    props.color ||
    theme.color ||
    ''}`
  const iconColorHover =
    (props.hoverStyle && props.hoverStyle.color) || theme.colorHover || 'inherit'

  const iconContext = useMemo<Partial<IconProps>>(() => {
    return {
      alt,
      opacity: iconOpacity,
      color: iconColor,
      justifyContent: 'center',
      hoverStyle: {
        ...selectObject(props.hoverStyle),
        color: iconColorHover,
      },
    }
  }, [alt, iconOpacity, iconColor, iconColorHover, JSON.stringify(props.hoverStyle || '')])

  let element = (
    <IconPropsContext.Provider value={iconContext}>
      <BreadcrumbReset>
        <SurfaceFrame
          className={`${tooltipState.id} ${(crumb && crumb.selector) || ''} ${className || ''}`}
          ref={forwardRef}
          themeSelect={themeSelect}
          lineHeight={lineHeight}
          pad={pad}
          padding={padding}
          borderWidth={borderWidth}
          borderPosition={borderPosition}
          alt={alt}
          {...throughProps}
          {...viewProps}
          {...segmentedStyle}
          {...childrenProps}
          {...!children && { tagName }}
          opacity={crumb && crumb.total === 0 ? 0 : props.opacity}
        />
      </BreadcrumbReset>
    </IconPropsContext.Provider>
  )

  return <Context.Reset>{forwardTheme({ children: element, theme: props.theme })}</Context.Reset>
})

const chromelessStyle = {
  borderColor: 'transparent',
  background: 'transparent',
}

// fontFamily: inherit on both fixes elements
const SurfaceFrame = gloss<ThroughProps & SurfaceProps>(Col, {
  fontFamily: 'inherit',
  position: 'relative',
  whiteSpace: 'pre',
  circular: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
}).theme((props, theme) => {
  // :hover, :focus, :active

  const themeStyle = psuedoStyleTheme(props, theme)
  const propStyles = propsToStyles(props, theme)
  const padStyle = getPadding(props)

  let styles: CSSPropertySet = {}
  let boxShadow = props.boxShadow || theme.boxShadow || []

  const borderColor = `${themeStyle.borderColor || ''}`
  const borderWidth = selectDefined(props.borderWidth, theme.borderWidth, 0)

  // borderPosition controls putting borders inside vs outside
  // useful for having nice looking buttons (inside) vs container-like views (outside)
  if (borderColor && borderWidth && !props.chromeless) {
    if (props.borderPosition === 'inside') {
      // inside
      boxShadow = [...boxShadow, ['inset', 0, 0, 0, borderWidth, borderColor]]
      styles.borderWidth = 0
    } else {
      // outside
      styles.border = [borderWidth, props.borderStyle || 'solid', borderColor]
    }
  }

  if (props.elevation) {
    boxShadow = [...boxShadow, getElevation(props).boxShadow]
  }

  styles = {
    boxShadow,
    fontWeight: props.fontWeight || theme.fontWeight,
    color: props.color || theme.color,
    overflow: props.overflow || theme.overflow,
    // note: base theme styles go *above* propsToStyles...
    ...(!props.chromeless && themeStyle),
    // TODO this could be automatically handled in propStyles if we want...
    ...(!props.chromeless && props.active && { '&:hover': themeStyle['&:active'] }),
    ...(props.chromeless && chromelessStyle),
    ...(props.circular && {
      width: props.height,
    }),
    '&:hover': props.active
      ? null
      : {
          ...(!props.chromeless && themeStyle['&:hover']),
          ...propStyles['&:hover'],
        },
    ...styles,
    ...padStyle,
  }

  return styles
})

const Element = gloss<ThroughProps & { disabled?: boolean; surfacePadX: number | string }>({
  flex: 1,
  overflow: 'hidden',
  // needed to reset for <button /> at least
  fontSize: 'inherit',
  padding: 0,
  flexDirection: 'row',
  fontFamily: 'inherit',
  border: 'none',
  background: 'transparent',
  height: '100%',
  lineHeight: 'inherit',
  color: 'inherit',
  transform: {
    y: 0.5,
  },
  ellipse: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}).theme(props => {
  const padX = px(selectDefined(props.surfacePadX, 0))
  const iconSize = getIconSize(props)
  const iconNegativePad = props.hasIcon ? `- ${padX} - ${iconSize + props.iconPad}px` : ''
  const style: CSSPropertySet = {}
  // spacing between icon
  const hasIconBefore = props.hasIcon && !props.iconAfter
  const hasIconAfter = props.hasIcon && props.iconAfter
  if (hasIconBefore) {
    style.marginLeft = props.iconPad
  }
  if (hasIconAfter) {
    style.marginRight = props.iconPad
  }
  return {
    ...props,
    maxWidth: props.maxWidth || `calc(100% ${iconNegativePad})`,
    ...style,
  }
})

const getIconSize = (props: SurfaceProps) => {
  const size =
    getSize(props.size) * (props.height ? +props.height * 0.15 + 5 : 12) * (props.sizeIcon || 1)
  return props.iconSize || Math.round(size * 100) / 100
}

const GlintContain = gloss(Col, {
  position: 'absolute',
  height: 'calc(100% - 1px)',
  top: 0,
  left: 0,
  right: 0,
  pointerEvents: 'none',
  zIndex: 10,
  overflow: 'hidden',
  transform: {
    y: 0.5,
  },
})

const getPadX = (padding: any) =>
  Array.isArray(padding) ? (+padding[1] || 0) + (+padding[3] || 0) : padding
