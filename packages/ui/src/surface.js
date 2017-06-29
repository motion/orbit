// @flow
import React from 'react'
import { view, inject } from '@mcro/black'
import type { ViewType } from '@mcro/black'
import $ from 'color'
import Icon from './icon'
import Glow from './effects/glow'
import Popover from './popover'
import type { Color } from '@mcro/gloss'

const LINE_HEIGHT = 30

@inject(context => context.uiContext)
@view.ui
export default class Surface implements ViewType<Props> {
  props: Props & {
    flex?: boolean | number,
    borderRadius: number,
    inSegment?: boolean,
    inForm?: boolean,
    clickable?: boolean,
    active?: boolean,
    chromeless?: boolean,
    inline?: boolean,
    dim?: boolean,
    stretch?: boolean,
    spaced?: boolean,
    highlight?: boolean,
    circular?: boolean,
    iconAfter?: boolean,
    iconColor?: Color,
    onClick?: Function,
    tooltip?: string,
    icon?: React$Element<any> | string,
    background?: Color,
    color?: Color,
    hoverColor?: Color,
    className?: string,
    theme?: string,
    after?: Element | string,
    children?: Element | string,
    elementStyles?: Object,
    iconProps?: Object,
    tooltipProps?: Object,
    tagName: string,
    size?: number,
    iconSize?: number,
    padding?: number | Array<number>,
    margin?: number | Array<number>,
    height?: number,
    glow?: boolean,
    noElement?: boolean,
    glint?: boolean,
    lightenOnHover?: boolean,
    darkenOnHover?: boolean,
    getRef?: Function,
    hoverable?: boolean,
  }

  static defaultProps = {
    tagName: 'div',
    size: 1,
  }

  uniq = `icon-${Math.round(Math.random() * 1000000)}`

  render({
    inSegment,
    inForm,
    onClick,
    clickable,
    children,
    icon,
    iconProps,
    iconSize: _iconSize,
    iconAfter,
    iconColor,
    color,
    active,
    highlight,
    spaced,
    after,
    chromeless,
    inline,
    dim,
    stretch,
    tagName,
    tooltip,
    tooltipProps,
    background,
    className,
    theme: _theme,
    circular,
    size,
    borderRadius,
    material,
    padding,
    height,
    margin,
    glow,
    hoverColor,
    wrapElement,
    elementStyles,
    getRef,
    noElement,
    flex,
    placeholderColor,
    borderColor,
    glint,
    hoverable,
    ...props
  }: Props) {
    const { theme } = this
    const hasIconBefore = icon && !iconAfter
    const hasIconAfter = icon && iconAfter
    const stringIcon = typeof icon === 'string'
    const iconSize =
      _iconSize ||
      (theme && theme.element.style.fontSize * 0.9) ||
      Math.log(size + 1) * 15

    const finalClassName = `${this.uniq} ${className || ''}`
    const passProps = {
      className: finalClassName,
      onClick,
      tagName,
      ref: getRef,
      ...props,
    }

    return (
      <surface {...!wrapElement && passProps}>
        <icon if={icon && !stringIcon} $iconAfter={hasIconAfter}>
          {icon}
        </icon>
        <Icon
          if={icon && stringIcon}
          $icon
          $iconAfter={hasIconAfter}
          name={icon}
          size={iconSize}
          {...iconProps}
        />
        <glowWrap if={glow} $minimal={chromeless}>
          <Glow
            full
            scale={1.5}
            color={(theme && theme.surface.style.color) || [0, 0, 0]}
            opacity={0.06}
          />
        </glowWrap>
        <element
          if={!noElement}
          {...wrapElement && passProps}
          $hasIconBefore={hasIconBefore}
          $hasIconAfter={hasIconAfter}
        >
          {children}
        </element>
        {after || null}
        <Popover
          if={tooltip}
          theme="dark"
          background
          openOnHover
          noHover
          animation="bounce 150ms"
          target={`.${this.uniq}`}
          padding={[0, 6]}
          distance={8}
          arrowSize={8}
          delay={100}
          popoverProps={{ $$style: { fontSize: 11 } }}
          {...tooltipProps}
        >
          {tooltip}
        </Popover>
      </surface>
    )
  }

  static style = {
    surface: {
      lineHeight: '1rem',
      fontWeight: 400,
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'transparent',
      position: 'relative',
    },
    glowWrap: {
      position: 'absolute',
      overflow: 'hidden',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10,
    },
    minimal: {
      boxShadow: 'none',
    },
    element: {
      border: 'none',
      background: 'transparent',
      userSelect: 'none',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      pointerEvents: 'none',
    },
    hasIconBefore: {
      marginLeft: '0.7vh',
    },
    hasIconAfter: {
      marginRight: '0.7vh',
    },
    iconAfter: {
      order: 3,
    },
  }

  surfaceStyle = {
    background: 'transparent',
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    margin: [-2, -3],
    maxHeight: '1.45rem',
    borderRadius: 1000,
  }

  disabledStyle = {
    opacity: 0.25,
    pointerEvents: 'none',
  }

  dimStyle = {
    opacity: 0.5,
    '&:hover': {
      opacity: 1,
    },
  }

  spacedStyles = {
    margin: [0, 5],
    borderRightWidth: 1,
  }

  static theme = (props, theme, self) => {
    // sizes
    const height = props.size * LINE_HEIGHT
    const width = props.width
    const padding =
      typeof props.padding !== 'undefined'
        ? props.padding
        : props.wrapElement ? 0 : [0, height / 4]
    const fontSize = props.fontSize || height * 0.5
    const flex = props.flex === true ? 1 : props.flex

    // radius
    const baseBorderRadius = props.borderRadius
      ? props.borderRadius
      : height / 5
    const borderRadius = props.circular
      ? height
      : baseBorderRadius || height / 10

    // colors
    const color = $(
      props.highlight
        ? props.highlightColor || theme.highlight.color || props.color
        : props.active ? theme.active.color : props.color || theme.base.color
    )

    const iconColor = props.iconColor || color
    const background = $(
      props.background || theme.base.background || 'transparent'
    )
    const borderColor = $(props.borderColor || theme.base.borderColor)

    // hover
    let hoverColor = $(props.hoverColor || theme.hover.color || props.color)
    const iconHoverColor = props.iconHoverColor || hoverColor
    // TODO this could be simpler/better
    if (props.lightenOnHover) {
      hoverColor = hoverColor.lighten(
        props.lightenOnHover === true ? 3 : props.lightenOnHover
      )
    } else if (props.darkenOnHover) {
      hoverColor = hoverColor.darken(
        props.darkenOnHover === true ? 3 : props.darkenOnHover
      )
    } else if (props.hoverable) {
      const luminosity = color.luminosity()
      const isLight = luminosity > 0.6
      const adjustDirection = isLight ? 'darken' : 'lighten'
      hoverColor = hoverColor[adjustDirection](luminosity / 2)
    }
    const hoverBorderColor =
      props.hoverBorderColor ||
      theme.hover.borderColor ||
      borderColor.lighten(1)

    // shadow
    const boxShadow = props.shadow === true ? [0, 5, 0, [0, 0, 0, 0.2]] : []

    if (props.glint) {
      const glintColor =
        props.glint === true ? background.lighten(3) : props.glint
      boxShadow.push(['inset', 0, '0.5px', 0, glintColor])
    }

    // general
    const overflow = props.glow ? 'hidden' : props.overflow

    const segmentStyles = props.inSegment && {
      marginLeft: -1,
      borderLeftRadius: props.inSegment.first ? borderRadius : 0,
      borderRightRadius: props.inSegment.last ? borderRadius : 0,
    }
    const circularStyles = props.circular && {
      padding: 0,
      width: height,
      borderRadius: props.size * LINE_HEIGHT,
      overflow: 'hidden',
    }

    return {
      element: {
        ...props.elementStyles,
        fontSize,
        lineHeight: '1px',
        color,
        '&:hover': {
          color: hoverColor,
        },
      },
      surface: {
        overflow,
        height,
        width,
        flex,
        padding,
        borderRadius,
        borderColor,
        background,
        boxShadow,
        ...circularStyles,
        ...segmentStyles,
        ...(props.inline && self.surfaceStyle),
        ...(props.disabled && self.disabledStyle),
        ...(props.dim && self.dimStyle),
        ...(props.spaced && self.spacedStyle),
        ...(props.chromeless && {
          borderWidth: 0,
        }),
        '& > icon': {
          color: iconColor,
        },
        '&:hover > icon': {
          color: iconHoverColor,
        },
        '&:hover': {
          ...theme.hover,
          color: hoverColor,
          borderColor: hoverBorderColor,
        },
        // this is just onmousedown
        '&:active': {
          position: 'relative',
          zIndex: 1000,
        },
        // inForm
        ...(props.inForm && {
          '&:active': theme.active,
          '&:focus': theme.focus,
        }),
      },
    }
  }
}
