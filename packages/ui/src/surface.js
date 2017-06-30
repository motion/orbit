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
export default class Surface implements ViewType {
  props: {
    elementProps?: boolean,
    flex?: boolean | number,
    width?: number,
    height?: number,
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
    borderWidth?: number | string,
    border?: Array | Object,
    borderBottom?: Array | Object,
    borderTop?: Array | Object,
    borderLeft?: Array | Object,
    borderRight?: Array | Object,
    marginBottom?: number,
    marginTop?: number,
    marginLeft?: number,
    marginRight?: number,
    paddingBottom?: number,
    paddingTop?: number,
    paddingLeft?: number,
    paddingRight?: number,
    borderStyle?: 'solid' | 'dotted',
    wrapElement?: boolean,
  }

  static defaultProps = {
    tagName: 'div',
    borderStyle: 'solid',
    borderWidth: 0,
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
    border,
    borderBottom,
    borderTop,
    borderLeft,
    borderRight,
    paddingBottom,
    paddingTop,
    paddingLeft,
    paddingRight,
    marginBottom,
    marginTop,
    marginLeft,
    marginRight,
    borderWidth,
    borderColor,
    borderRadius,
    material,
    padding,
    height,
    margin,
    glow,
    hoverColor,
    getRef,
    noElement,
    flex,
    placeholderColor,
    glint,
    hoverable,
    width,
    style,
    wrapElement,
    borderStyle,
    elementProps,
    ...props
  }) {
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
        <Glow
          if={glow}
          full
          scale={1.5}
          color={(theme && theme.surface.style.color) || [0, 0, 0]}
          opacity={0.06}
        />
        <element
          if={!noElement || (noElement && children)}
          {...wrapElement && passProps}
          {...elementProps}
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
      position: 'relative',
    },
    element: {
      border: 'none',
      background: 'transparent',
      userSelect: 'none',
      height: '100%',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'stretch',
    },
    icon: {
      pointerEvents: 'none',
    },
    hasIconBefore: {
      marginLeft: '1vh',
    },
    hasIconAfter: {
      marginRight: '1vh',
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
    const height = props.height
    const width = props.width
    const padding = props.padding
    const flex = props.flex === true ? 1 : props.flex
    const borderRadius = props.circular ? height : props.borderRadius

    // colors
    const color = $(
      props.highlight
        ? props.highlightColor || theme.highlight.color || props.color
        : props.active ? theme.active.color : props.color || theme.base.color
    )

    const iconColor = props.iconColor || color
    const baseBackground =
      props.background || theme.base.background || 'transparent'
    const background = $(
      props.active
        ? props.activeBackground || theme.active.background || baseBackground
        : baseBackground
    )
    const borderColor = $(
      props.borderColor || theme.base.borderColor || 'transparent'
    )

    // hover
    let hoverColor = $(
      props.highlight
        ? color.lighten(0.2)
        : props.hoverColor || theme.hover.color || props.color
    )
    // TODO this could be simpler/better
    if (props.lightenOnHover) {
      hoverColor = hoverColor.lighten(
        props.lightenOnHover === true ? 3 : props.lightenOnHover
      )
    } else if (props.darkenOnHover) {
      hoverColor = hoverColor.darken(
        props.darkenOnHover === true ? 3 : props.darkenOnHover
      )
    }
    const hoverBorderColor =
      props.hoverBorderColor ||
      theme.hover.borderColor ||
      borderColor.lighten(1)

    // shadow
    const boxShadow = props.shadow === true ? [0, 5, 0, [0, 0, 0, 0.2]] : []

    if (props.glint) {
      const glintColor =
        props.glint === true
          ? background.alpha(1).lighten(100).toString()
          : props.glint
      boxShadow.push(['inset', 0, '0.5px', 0, glintColor])
    }

    const segmentedBorderRadius = props.inSegment && {
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
        borderRadius,
        ...segmentedBorderRadius,
        fontSize: props.fontSize,
        lineHeight: '0px',
      },
      surface: {
        color,
        overflow: props.glow ? 'hidden' : props.overflow,
        height,
        width,
        flex,
        padding,
        borderRadius,
        borderColor,
        background,
        boxShadow,
        margin: props.margin,
        borderWidth: props.borderWidth,
        borderStyle: props.borderStyle,
        border: props.border,
        borderBottom: props.borderBottom,
        borderTop: props.borderTop,
        borderLeft: props.borderLeft,
        borderRight: props.borderRight,
        marginBottom: props.marginBottom,
        marginTop: props.marginTop,
        marginLeft: props.inSegment ? -1 : props.marginLeft,
        marginRight: props.marginRight,
        paddingBottom: props.paddingBottom,
        paddingTop: props.paddingTop,
        paddingLeft: props.paddingLeft,
        paddingRight: props.paddingRight,
        ...(props.wrapElement &&
        props.inForm && {
          '& > :active': theme.active,
          '& > :focus': theme.focus,
        }),
        ...(!props.wrapElement &&
        props.inForm && {
          '&:active': theme.active,
          '&:focus': theme.focus,
        }),
        ...circularStyles,
        ...segmentedBorderRadius,
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
          color: props.iconHoverColor || hoverColor,
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
        // so you can override
        ...props.style,
      },
    }
  }
}
