import { ColorLike } from '@o/color'
import { CSSPropertySet } from '@o/css'
import { isDefined, selectDefined } from '@o/utils'
import { Box, CompiledTheme, Flex, gloss, GlossProps, propsToStyles, pseudoProps, PseudoStyle, PseudoStyleProps, pseudoStyleTheme, ThemeFn, ThemeSelect, ThemeValue, useTheme } from 'gloss'
import React, { HTMLProps, useEffect, useMemo, useState } from 'react'

import { Badge } from './Badge'
import { useBreadcrumb, useBreadcrumbReset } from './Breadcrumbs'
import { Glint } from './effects/Glint'
import { HoverGlow } from './effects/HoverGlow'
import { themeable } from './helpers/themeable'
import { useSizedSurfaceProps } from './hooks/useSizedSurface'
import { Icon, IconProps } from './Icon'
import { IconPropsContext } from './IconPropsContext'
import { InvertScale } from './InvertScale'
import { PassProps } from './PassProps'
import { PopoverProps } from './Popover'
import { getSegmentedStyle } from './SegmentedRow'
import { getSize } from './Sizes'
import { Size, Space } from './Space'
import { SizedSurfacePropsContext } from './SurfacePropsContext'
import { textSizeTheme } from './text/textSizeTheme'
import { Tooltip } from './Tooltip'
import { elevationTheme } from './View/elevation'
import { marginTheme } from './View/marginTheme'
import { ViewProps, ViewPropsPlain } from './View/types'
import { View } from './View/View'

// an element for creating surfaces that look like buttons
// they basically can control a prefix/postfix icon, and a few other bells

/** Controlled height, relative adjusted to size */
export type SizedSurfaceSpecificProps = {
  /** size affects all other sizing props */
  size?: Size

  sizeHeight?: boolean | number

  /** Controlled font size, relative adjusted to size */
  sizeFont?: boolean | number

  /** Controlled horizontal padding, relative adjusted to size */
  sizePadding?: boolean | number

  /** Controlled margin, relative adjusted to size */
  sizeMargin?: boolean | number

  /** Controlled border radius size, relative adjusted to size */
  sizeRadius?: boolean | number

  /** Controlled icon size, relative adjusted to size */
  sizeIcon?: boolean | number
}

export type SurfaceSpecificProps = SizedSurfaceSpecificProps & {
  /** Inside uses a shadow instead of border for finder borders */
  borderPosition?: 'inside' | 'outside'

  /** Force focus state on */
  focus?: boolean

  /** Force hover state on */
  hover?: boolean

  /** Force active state on  */
  active?: boolean

  /** Ellipse text used inside children of surface */
  ellipse?: boolean

  /** Element before surface elements */
  before?: React.ReactNode

  /** Element after surface elements */
  after?: React.ReactNode

  /** Add a badge to surface, see <Badge /> */
  badge?: React.ReactNode

  /** Extra props for badge */
  badgeProps?: Object

  /** Button children / text */
  children?: React.ReactNode

  /** Name for surface  */
  name?: string

  /** Removes background, border, glint styles */
  chromeless?: boolean

  /** Forces surface into circle shape */
  circular?: boolean

  /** Add extra props to the inner element  */
  elementProps?: Object

  /** Props for <Glint />, shown at bottom of surface */
  glintBottom?: boolean

  /** Props for <Glint />, shown at top of surface */
  glint?: boolean

  /** Add a <HoverGlow /> to the surface */
  glow?: boolean

  /** Add <HoverGlwo /> props if glow enabled */
  glowProps?: Object

  /** Add a <HoverGlow /> to the surface */
  hovered?: boolean

  /** Name for <Icon /> element, or custom element */
  icon?: React.ReactNode

  /** Show icon after text */
  iconAfter?: boolean

  /** Set icon color separately */
  iconColor?: ColorLike

  /** Extra props for <Icon /> element */
  iconProps?: Partial<IconProps>

  /** Set icon size separately */
  iconSize?: number

  /** Avoid adding the inner element: will prevent icons from working */
  noInnerElement?: boolean

  theme?: CompiledTheme

  /** Adds a <Tooltip /> on the surface */
  tooltip?: React.ReactNode

  /** Extra props for the <Tooltip /> */
  tooltipProps?: PopoverProps

  /** Text alpha */
  alpha?: number

  /** Text alpha on hover */
  alphaHover?: number

  /** Force disabled state of surface */
  disabled?: boolean

  /** HTML prop type */
  type?: string

  /** Select a subset theme easily */
  subTheme?: ThemeSelect

  /** Amount to pad icon */
  iconPadding?: number

  /** Force ignore grouping */
  ignoreSegment?: boolean

  /** Override space between sizing between Icon/Element */
  space?: Size

  /** Override space between sizing between Icon/Element */
  spaceAround?: Size

  /** Add an element between the icon and inner element */
  betweenIconElement?: React.ReactNode

  /** Style as part of a group */
  segment?: 'first' | 'last' | 'middle' | 'single'

  /** [Advanced] Add an extra theme to the inner element */
  elementTheme?: ThemeFn
}

export type SurfaceProps = GlossProps<
  Omit<
    ViewPropsPlain,
    'size' | 'activeStyle' | 'focusStyle' | 'focusWithinStyle' | 'disabledStyle' | 'selectedStyle'
  > &
    SurfaceSpecificProps &
    PseudoThemeProps
>

const getBorderRadius = (t, b, l, r, tl, tr, bl, br) => {
  return {
    borderTopLeftRadius: selectDefined(tl, t, l),
    borderTopRightRadius: selectDefined(tr, t, r),
    borderBottomRightRadius: selectDefined(br, b, r),
    borderBottomLeftRadius: selectDefined(bl, b, l),
  }
}

type ThroughProps = Pick<
  SurfaceProps,
  | 'iconPadding'
  | 'alignItems'
  | 'justifyContent'
  | 'sizeIcon'
  | 'iconSize'
  | 'iconAfter'
  | 'fontWeight'
  | 'ellipse'
  | 'overflow'
  | 'textDecoration'
  | 'elementTheme'
> & {
  hasIcon: boolean
  tagName?: string
}

const acceptsIcon = child =>
  child && child.type.acceptsProps && child.type.acceptsProps.icon === true

// why? need to document bug that led to this hackty patch
// im guessing popover is looking for selector too early, that should be patched in popover
const setTooltip = (tooltip, setTooltipState) => {
  if (tooltip) {
    setTooltipState(prev => {
      prev.id = prev.id || `Surface-${Math.round(Math.random() * 100000000)}`
      prev.show = false
      return prev
    })

    let tm = setTimeout(() => {
      setTooltipState(prev => {
        prev.show = true
        return prev
      })
    })
    return () => clearTimeout(tm)
  }
}

export const Surface = themeable(function Surface(direct: SurfaceProps) {
  const sizedProps = useSizedSurfaceProps(direct)
  const props = SizedSurfacePropsContext.useProps(sizedProps) as SurfaceProps
  const crumb = useBreadcrumb()
  const [tooltipState, setTooltipState] = useState({ id: null, show: false })
  const theme = useTheme()

  const {
    alignItems,
    children,
    className,
    disabled,
    elementProps,
    elementTheme,
    glintBottom,
    glint,
    glow,
    glowProps,
    height,
    icon,
    iconAfter,
    iconPadding,
    iconProps,
    justifyContent,
    noInnerElement,
    size: ogSize,
    sizeLineHeight,
    tagName,
    subTheme: subTheme,
    tooltip,
    tooltipProps,
    padding,
    badgeProps,
    badge,
    after,
    borderPosition = 'outside',
    borderWidth,
    coat,
    before,
    dangerouslySetInnerHTML,
    space,
    spaceAround,
    betweenIconElement,
    borderTopRadius,
    borderBottomRadius,
    ...viewProps
  } = props

  const size = getSize(selectDefined(ogSize, 1))
  const segmentedStyle = getSegmentedStyle(props, crumb)
  const stringIcon = typeof icon === 'string'

  useEffect(() => setTooltip(tooltip, setTooltipState), [tooltip])

  // goes to BOTH the outer element and inner element
  let throughProps: ThroughProps = {
    elementTheme,
    iconPadding: typeof iconPadding === 'number' ? iconPadding : size * 8,
    alignItems,
    justifyContent,
    sizeIcon: props.sizeIcon,
    iconSize: props.iconSize,
    iconAfter: props.iconAfter,
    hasIcon: !!props.icon,
    fontWeight: props.fontWeight,
    ellipse: props.ellipse,
    overflow: props.overflow,
    textDecoration: props.textDecoration,
  }

  let lineHeight = props.lineHeight
  if (!props.lineHeight && sizeLineHeight && +height == +height) {
    // @ts-ignore
    lineHeight = typeof height === 'number' ? `${height * 0.92}px` : height
  }

  const childrenProps: HTMLProps<HTMLDivElement> = {}

  const pxHeight = +height == +height
  const borderLeftRadius = selectDefined(
    props.borderLeftRadius ? +props.borderLeftRadius : undefined,
    segmentedStyle ? segmentedStyle.borderLeftRadius : +props.borderRadius,
    pxHeight ? +height / 2 : undefined,
    0,
  )
  const borderRightRadius = selectDefined(
    props.borderRightRadius ? +props.borderRightRadius : undefined,
    segmentedStyle ? segmentedStyle.borderRightRadius : +props.borderRadius,
    pxHeight ? +height / 2 : undefined,
    0,
  )
  const borderProps = getBorderRadius(
    borderTopRadius,
    borderBottomRadius,
    borderLeftRadius,
    borderRightRadius,
    props.borderTopLeftRadius,
    props.borderTopRightRadius,
    props.borderBottomRightRadius,
    props.borderBottomLeftRadius,
  )

  const disableGlint = theme.disableGlint ? theme.disableGlint.get() : false
  const hasAnyGlint = !disableGlint && !props.chromeless && !!(glint || glintBottom)
  let showElement = false

  // because we can't define children at all on tags like input
  // we conditionally set children here to avoid having children: undefined
  if (dangerouslySetInnerHTML) {
    childrenProps.dangerouslySetInnerHTML = dangerouslySetInnerHTML
  } else if (noInnerElement) {
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
    showElement = !!(hasChildren(children) || elementProps)
    const spaceElement = <Space size={selectDefined(space, size * 6)} />

    const innerElements = !!icon && (
      <PassProps
        passCondition={acceptsIcon}
        coat={coat}
        size={getIconSize(props)}
        opacity={selectDefined(props.alpha, props.opacity)}
        hoverStyle={props.hoverStyle}
        activeStyle={props.activeStyle}
        focusStyle={props.focusStyle}
        disabledStyle={props.disabledStyle}
        {...iconProps}
      >
        {!stringIcon && icon}
        {stringIcon && <Icon name={`${icon}`} />}
      </PassProps>
    )

    childrenProps.children = (
      <>
        {before}
        {!!badge && (
          <Badge
            coat={coat}
            zIndex={typeof props.zIndex === 'number' ? props.zIndex + 1 : 100}
            position="absolute"
            top="-18%"
            left="-18%"
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
        {/* TODO: this can be one element i think */}
        {hasAnyGlint && (
          <GlintContain
            className="ui-glint-contain"
            {...borderProps}
            {...(borderPosition === 'inside' &&
              borderWidth > 0 && {
                height: roundHalf(+height - size / 2) - 1,
                transform: {
                  y: roundHalf(size),
                },
              })}
          >
            {glint && !props.chromeless && (
              <Glint className="ui-glint-top" coat={coat} size={size} {...borderProps} subTheme={subTheme} />
            )}
            {glintBottom && !props.chromeless && (
              <Glint className="ui-glint-bottom" coat={coat} size={size} bottom={0} {...borderProps} subTheme={subTheme} />
            )}
          </GlintContain>
        )}
        {!!icon && iconAfter ? (
          <Box
            style={
              {
                flexDirection: 'inherit',
                order: 3,
              } as any
            }
          >
            {showElement && spaceElement}
            {!!betweenIconElement && (
              <>
                {betweenIconElement}
                {spaceElement}
              </>
            )}
            {innerElements}
          </Box>
        ) : (
          <>
            {innerElements}
            {!!betweenIconElement && (
              <>
                {spaceElement}
                {betweenIconElement}
              </>
            )}
            {showElement && icon && spaceElement}
          </>
        )}
        {!!glow && !disabled && (
          <HoverGlow
            full
            scale={1.1}
            opacity={0.35}
            borderRadius={+props.borderRadius}
            {...glowProps}
          />
        )}
        {showElement && (
          <Element
            {...throughProps}
            height={pxHeight ? '100%' : undefined}
            {...elementProps}
            disabled={disabled}
            elementTheme={elementTheme}
            tagName={tagName}
          >
            {children}
          </Element>
        )}
        {!!after && (
          <>
            {spaceElement}
            {after}
          </>
        )}
      </>
    )
  }

  // automatically invert transition
  if (props.layoutTransition) {
    const ogChildren = childrenProps.children
    childrenProps.children = <InvertScale>{ogChildren}</InvertScale>
  }

  const iconOpacity = props.alpha ?? props.opacity
  const iconColor = props.iconProps?.color ?? props.color
  const iconColorHover = props?.iconProps?.colorHover ?? props?.colorHover
  const iconContext = useMemo<Partial<IconProps>>(() => {
    return {
      coat,
      opacity: iconOpacity,
      color: iconColor ?? (theme => theme.color),
      colorHover: iconColorHover ?? (theme => theme.colorHover),
      justifyContent: 'center',
    }
  }, [coat, iconOpacity, iconColor, iconColorHover])

  // @ts-ignore
  const surfaceFrameProps: SurfaceFrameProps = {
    className: `${tooltipState.id ?? ''} ${(crumb && crumb.selector) ?? ''} ${className ?? ''}`.trim(),
    subTheme: subTheme,
    lineHeight,
    padding,
    borderWidth,
    borderPosition,
    coat,
    height,
    applyPsuedoColors: true,
    disabled,
    ...(!showElement && elementProps),
    ...throughProps,
    ...viewProps,
    ...segmentedStyle,
    // ensure borderTopRadius, borderBottomRadius override
    borderTopRadius,
    borderBottomRadius,
    ...childrenProps,
    tagName: !showElement ? tagName : 'div',
    opacity: crumb && crumb.total === 0 ? 0 : props.opacity,
  }

  return useBreadcrumbReset(
    SizedSurfacePropsContext.useReset(
      <IconPropsContext.Provider value={iconContext}>
        <SurfaceFrame coat={coat} {...surfaceFrameProps} />
      </IconPropsContext.Provider>,
    ),
  )
})

Surface['defaultProps'] = {
  // todo better pattern here
  baseOverridesPsuedo: true,
}

const hasChildren = (children: React.ReactNode) => {
  if (Array.isArray(children)) {
    return children.some(x => isDefined(x) && x !== null && x !== false)
  }
  return !!children
}

const chromelessStyle = {
  borderColor: 'transparent',
  background: 'transparent',
}

type PseudoThemeProps = {
  [K in keyof PseudoStyleProps]: ThemeFn | PseudoStyle
}

/**
 * Allows you to pass theme functions as props
 */
const pseudoFunctionThemes /* : ThemeFn<PseudoThemeProps> */ = (props, prev) => {
  for (const key in pseudoProps) {
    if (typeof props[key] === 'function') {
      const val = props[key](props, prev)
      if (val) {
        prev[key] = prev[key] || {}
        Object.assign(prev[key], val)
      }
    }
  }
}

// fontFamily: inherit on both fixes elements
const SurfaceFrame = gloss<ThroughProps, ViewProps>(View, {
  fontFamily: 'inherit',
  position: 'relative',
  whiteSpace: 'pre',

  conditional: {
    circular: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
    },
    disabled: {
      cursor: 'not-allowed',
    },
  },
}).theme(pseudoFunctionThemes, pseudoStyleTheme, (props, prev) => {
  // todo fix types here
  const marginStyle = marginTheme(props as any)
  const { fontSize, lineHeight } = textSizeTheme(props)

  if (prev && props.chromeless) {
    delete prev.hoverStyle
    delete prev.activeStyle
  }

  let styles: CSSPropertySet = {}
  let boxShadow = [].concat(props.boxShadow || null).filter(Boolean)

  const borderWidth = selectDefined(props.borderWidth, 0)

  // borderPosition controls putting borders inside vs outside
  // useful for having nice looking buttons (inside) vs container-like views (outside)
  if (props.borderColor && !props.chromeless) {
    if (props.borderPosition === 'inside') {
      const borderWidthValue = borderWidth instanceof ThemeValue ? borderWidth.getSafe() : borderWidth
      const borderWidthCalculated = typeof borderWidthValue === 'number' ? `calc(${borderWidthValue} * 1px)` : borderWidthValue
      // inside
      boxShadow = [...(boxShadow || []), ['inset', 0, 0, 0, borderWidthCalculated, props.borderColor]]
      styles.borderWidth = 0
    } else {
      // outside
      styles.border = [borderWidth, props.borderStyle || 'solid', props.borderColor]
    }
  }

  if (props.elevation) {
    // @ts-ignore
    boxShadow = [...(boxShadow || []), ...elevationTheme(props as any).boxShadow]
  }

  const res = {
    ...(props.chromeless && chromelessStyle),
    ...(props.circular && {
      width: props.height,
    }),
    fontSize,
    lineHeight,
    ...marginStyle,
    ...styles,
    boxShadow,
  }

  return res
})

const applyElementTheme: ThemeFn<any> = props =>
  props.elementTheme ? props.elementTheme(props) : null

const Element = gloss<ThroughProps & { disabled?: boolean }>({
  display: 'flex', // in case they change tagName
  flex: 1,
  overflow: 'hidden',
  // needed to reset for <button /> at least
  fontSize: 'inherit',
  lineHeight: 'inherit',
  color: 'inherit',
  textAlign: 'inherit',
  fontFamily: 'inherit',
  padding: 0,
  flexDirection: 'row',
  border: 'none',
  background: 'transparent',
  // otherwise it wont be full height so impossible to position things at start/end
  height: 'inherit',

  conditional: {
    ellipse: {
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },
}).theme(propsToStyles, applyElementTheme)

const getIconSize = (props: SurfaceProps) => {
  if (isDefined(props.iconSize)) return props.iconSize
  const iconSize = props.height ? +props.height * 0.1 + 8 : 12
  const size =
    getSize(props.size) *
    iconSize *
    (props.sizeIcon === true ? 1 : selectDefined(props.sizeIcon, 1))
  return Math.floor(size)
}

const GlintContain = gloss(Flex, {
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  pointerEvents: 'none',
  zIndex: 10,
  overflow: 'hidden',
})

const roundHalf = (x: number) => {
  const oneDec = Math.round((x % 1) * 10) / 10
  const roundedToPointFive = oneDec > 6 ? 0.5 : 0
  return Math.floor(x) + roundedToPointFive
}
