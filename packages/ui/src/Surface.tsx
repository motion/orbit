import { ColorLike, CSSPropertySet, CSSPropertySetStrict } from '@o/css'
import Gloss, {
  Col,
  ColProps,
  forwardTheme,
  gloss,
  propsToStyles,
  psuedoStyleTheme,
  useTheme,
} from '@o/gloss'
import { isDefined, selectDefined, selectObject } from '@o/utils'
import { isObject } from 'lodash'
import React, { HTMLProps, useEffect, useMemo, useState } from 'react'

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
import { Sizes, Space } from './Space'
import { Tooltip } from './Tooltip'
import { Omit } from './types'
import { getElevation } from './View/elevate'
import { getPadding } from './View/pad'
import { getMargin, ViewProps } from './View/View'

// an element for creating surfaces that look like buttons
// they basically can control a prefix/postfix icon, and a few other bells

export type SurfaceSpecificProps = {
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

  /** Pass a ref to the outer html element */
  forwardRef?: React.Ref<any>

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

  /** Size of the surface */
  size?: Sizes

  /** Size (relative) of the icon */
  sizeIcon?: number

  theme?: Gloss.ThemeObject | string

  /** Adds a <Tooltip /> on the surface */
  tooltip?: React.ReactNode

  /** Extra props for the <Tooltip /> */
  tooltipProps?: PopoverProps

  width?: number | string

  /** Text alpha */
  alpha?: number

  /** Text alpha on hover */
  alphaHover?: number

  /** Force disabled state of surface */
  disabled?: boolean

  /** HTML prop type */
  type?: string

  /** Select a subset theme easily */
  themeSelect?: Gloss.ThemeSelect

  /** Amount to pad icon */
  iconPad?: number

  /** Force ignore grouping */
  ignoreSegment?: boolean

  /** Override space between sizing between Icon/Element */
  spaceSize?: Sizes

  /** [Advanced] Add an extra theme to the inner element */
  elementTheme?: Gloss.ThemeFn
}

export type SurfaceProps = Omit<ViewProps, 'size'> & SurfaceSpecificProps

// TODO this is using SizedSurfaceProps, needs some work to separate the two
const Context = createContextualProps<SizedSurfaceProps>()
export const SurfacePassPropsReset = Context.Reset
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
  | 'textDecoration'
  | 'elementTheme'
> & {
  hasIcon: boolean
  tagName?: string
}

const acceptsIcon = child => child && child.type.acceptsIconProps === true

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
    elementTheme,
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
    themeSelect,
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
    dangerouslySetInnerHTML,
    spaceSize,
    ...viewProps
  } = props
  const size = getSize(selectDefined(ogSize, 1))
  const segmentedStyle = getSegmentedStyle(props, crumb)
  const stringIcon = typeof icon === 'string'

  // goes to BOTH the outer element and inner element
  let throughProps: ThroughProps = {
    height,
    iconPad: typeof iconPad === 'number' ? iconPad : size * 8,
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
  if (sizeLineHeight) {
    lineHeight = `${height}px`
  }

  if (noInnerElement) {
    throughProps.tagName = tagName
    if (elementProps) {
      throughProps = {
        elementTheme,
        ...throughProps,
        ...elementProps,
      }
    }
  }

  const childrenProps: HTMLProps<HTMLDivElement> = {}

  const borderLeftRadius = Math.min(
    segmentedStyle ? segmentedStyle.borderLeftRadius : +props.borderRadius,
    +height / 2,
  )
  const borderRightRadius = Math.min(
    segmentedStyle ? segmentedStyle.borderRightRadius : +props.borderRadius,
    +height / 2,
  )

  const hasAnyGlint = !props.chromeless && !!(glint || glintBottom)
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
    showElement = !!(children || elementProps)

    const innerElements = (
      <PassProps
        passCondition={acceptsIcon}
        alt={alt}
        size={getIconSize(props)}
        opacity={selectDefined(props.alpha, props.opacity)}
        hoverStyle={props.hoverStyle}
        activeStyle={props.activeStyle}
        focusStyle={props.focusStyle}
        color="inherit"
        {...perfectCenterStyle(throughProps)}
        {...iconProps}
      >
        {icon && !stringIcon && icon}
        {icon && stringIcon && <Icon name={`${icon}`} />}
      </PassProps>
    )

    childrenProps.children = (
      <>
        {before}
        {!!badge && (
          <Badge
            alt={alt}
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
        {hasAnyGlint && (
          <GlintContain
            className="ui-glint-contain"
            borderLeftRadius={borderLeftRadius + 1}
            borderRightRadius={borderRightRadius + 1}
            {...borderPosition === 'inside' && {
              height: roundHalf(+height - size),
              transform: {
                y: roundHalf(size),
              },
            }}
          >
            {glint && !props.chromeless && (
              <Glint
                alt={alt}
                size={size}
                borderLeftRadius={borderLeftRadius}
                borderRightRadius={borderRightRadius}
                themeSelect={themeSelect}
              />
            )}
            {glintBottom && !props.chromeless && (
              <Glint
                alt={alt}
                size={size}
                bottom={0}
                borderLeftRadius={borderLeftRadius}
                borderRightRadius={borderRightRadius}
                themeSelect={themeSelect}
              />
            )}
          </GlintContain>
        )}
        {icon && iconAfter ? (
          <div
            style={{
              flexDirection: 'inherit',
              order: 3,
            }}
          >
            {showElement && <Space size={selectDefined(spaceSize, size * 8)} />}
            {innerElements}
          </div>
        ) : (
          <>
            {innerElements}
            {showElement && icon && <Space size={selectDefined(spaceSize, size * 8)} />}
          </>
        )}
        {glow && !disabled && (
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
            {...elementProps}
            disabled={disabled}
            elementTheme={elementTheme}
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
    (isObject(props.hoverStyle) && props.hoverStyle.color) || theme.colorHover || 'inherit'

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
          applyPsuedoColors
          {...!showElement && elementProps}
          {...throughProps}
          {...viewProps}
          {...segmentedStyle}
          {...childrenProps}
          {...!noInnerElement && { tagName }}
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
  display: 'flex', // in case they change tagName
  fontFamily: 'inherit',
  position: 'relative',
  whiteSpace: 'pre',

  '&:active .ui-glint-contain': {
    opacity: 0,
  },

  circular: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
}).theme((props, theme) => {
  // :hover, :focus, :active

  const themeStyle = psuedoStyleTheme(props, theme)
  const propStyles = propsToStyles(props, theme)
  const marginStyle = getMargin(props)

  let styles: CSSPropertySet = {}
  let boxShadow = props.boxShadow || theme.boxShadow || []

  const borderColor = `${themeStyle.borderColor || ''}`
  const borderWidth = selectDefined(props.borderWidth, theme.borderWidth, 0)

  // borderPosition controls putting borders inside vs outside
  // useful for having nice looking buttons (inside) vs container-like views (outside)
  if (borderColor && !props.chromeless) {
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

  const padStyle = getPadding(props)

  styles = {
    boxShadow,
    fontWeight: props.fontWeight || theme.fontWeight,
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
    ...marginStyle,
    // we use spacers for padding so we can actually set width: 0; see:
    padding: 0,
    '&:before': padStyle && {
      display: 'block',
      content: '" "',
      width: padStyle.padding[1],
    },
    '&:after': padStyle && {
      display: 'block',
      content: '" "',
      width: 10 || selectDefined(padStyle.padding[3], padStyle.padding[1]),
    },
  }

  return styles
})

const perfectCenterStyle = props => {
  if (props.height && props.height % 2 === 1) {
    return {
      transform: {
        y: 0.5,
      },
    }
  }
}

const applyElementTheme = (props, theme) =>
  props.elementTheme ? props.elementTheme(props, theme) : null

const Element = gloss<CSSPropertySetStrict & ThroughProps & { disabled?: boolean }>({
  display: 'flex', // in case they change tagName
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
  textAlign: 'inherit',
  ellipse: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}).theme(propsToStyles, perfectCenterStyle, applyElementTheme)

const getIconSize = (props: SurfaceProps) => {
  if (isDefined(props.iconSize)) return props.iconSize
  const iconSize = props.height ? +props.height * 0.15 + 5 : 12
  const size = getSize(props.size) * iconSize * (props.sizeIcon || 1)
  return Math.round(size * 100) / 100
}

const GlintContain = gloss<ColProps>(Col, {
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
  const roundedToPointFive = oneDec > 7 ? 1 : oneDec > 2 ? 0.5 : 0
  return Math.floor(x) + roundedToPointFive
}
