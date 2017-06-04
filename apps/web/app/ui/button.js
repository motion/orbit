// @flow
import React from 'react'
import { view, inject, clr } from '~/helpers'
import Icon from './icon'
import Glow from './glow'
import Popover from './popover'
import type { Color } from 'gloss'

const idFn = _ => _

@inject(context => context.ui)
@view.ui
export default class Button {
  props: {
    segmented?: object,
    formed?: boolean,
    clickable?: boolean,
    active?: boolean,
    chromeless?: boolean,
    dim?: boolean,
    stretch?: boolean,
    spaced?: boolean,
    circular?: boolean,
    iconAfter?: boolean,
    onClick?: Function,
    tooltip?: string,
    icon?: string,
    color?: Color,
    className?: string,
    theme?: string,
    after?: Element | string,
    children?: Element | string,
    iconProps?: Object,
    tooltipProps?: Object,
    circleProps?: Object,
    size?: number,
    iconSize?: number,
  }

  static defaultProps = {
    iconColor: '#999',
    iconSize: 12,
    onClick: idFn,
    borderRadius: 50,
  }

  uniq = `icon-${Math.round(Math.random() * 1000000)}`

  render() {
    const {
      segmented,
      onClick,
      clickable,
      children,
      icon,
      iconProps,
      iconSize,
      iconAfter,
      iconColor,
      color,
      active,
      spaced,
      after,
      chromeless,
      dim,
      stretch,
      tooltip,
      tooltipProps,
      className,
      theme,
      circular,
      size,
      circleProps,
      borderRadius,
      material,
      form,
      ...props
    } = this.props

    const hasIconBefore = icon && !iconAfter
    const hasIconAfter = icon && iconAfter

    return (
      <button
        $$borderRadius={borderRadius}
        $segmented={segmented && this.props}
        $color={color}
        $clickable={!!onClick || clickable}
        $isActive={active}
        className={`${className || ''} ${this.uniq}`}
        onClick={onClick}
        {...props}
      >
        <Icon
          if={icon}
          $icon
          $iconAfter={hasIconAfter}
          name={icon}
          size={iconSize}
          color={active ? '#000' : color || iconColor}
          {...iconProps}
        />
        <children
          if={children}
          $hasIconBefore={hasIconBefore}
          $hasIconAfter={hasIconAfter}
          style={{ color }}
        >
          <glowWrap if={!active}>
            <Glow full scale={1} color={[0, 0, 0]} opacity={0.08} />
          </glowWrap>
          {children}
        </children>
        {after || null}
        <Popover
          if={tooltip}
          theme="dark"
          background
          openOnHover
          animation="bounce 150ms"
          noHover
          target={`.${this.uniq}`}
          padding={[0, 6]}
          distance={8}
          arrowSize={8}
          popoverProps={{ $$style: { fontSize: 11 } }}
          {...tooltipProps}
        >
          {tooltip}
        </Popover>
      </button>
    )
  }

  static style = {
    button: {
      background: 'transparent',
      overflow: 'hidden',
      lineHeight: '1rem',
      fontSize: 13,
      fontWeight: 400,
      padding: [0, 10],
      height: 30,
      alignItems: 'center',
      flexFlow: 'row',
      justifyContent: 'center',
      border: [1, '#eee'],
      position: 'relative',
      // '&:active': {
      //   borderColor: 'blue',
      // },
    },
    segmented: ({ borderRadius, circular, segmented: { first, last } }) => ({
      borderRightWidth: 1,
      borderLeftWidth: 0,
      ...(first && {
        borderLeftRadius: circular ? 1000 : borderRadius,
        borderLeftWidth: 1,
      }),
      ...(last && {
        borderRightRadius: circular ? 1000 : borderRadius,
      }),
      ...(last &&
      !first && {
        borderLeftWidth: 0,
      }),
    }),
    color: color => ({
      color,
    }),
    clickable: {
      cursor: 'pointer',
    },
    isActive: {
      background: '#eee',
      '&:hover': {
        background: '#eee',
      },
    },
    children: {
      userSelect: 'none',
    },
    icon: {
      pointerEvents: 'none',
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
    hasIconBefore: {
      marginLeft: 5,
    },
    hasIconAfter: {
      marginRight: 5,
    },
    iconAfter: {
      order: 3,
    },
  }

  static theme = {
    theme: (props, context, activeTheme) => {
      return {
        button: {
          ...activeTheme.base,
          '&:hover': activeTheme.hover,
        },
        isActive: {
          ...activeTheme.active,
          '&:hover': activeTheme.active,
        },
        clickable: {
          '&:hover': {
            background: activeTheme.background,
          },
        },
      }
    },
    spaced: {
      button: {
        margin: [0, 5],
        borderRightWidth: 1,
      },
    },
    stretch: {
      button: {
        flex: 1,
      },
    },
    circular: ({ size }) => ({
      button: {
        borderRadius: 10000,
        width: size,
        height: size,
      },
    }),
    chromeless: {
      button: {
        border: 'none !important',
        borderWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        '&:hover': {
          opacity: 0.8,
        },
      },
    },
    disabled: {
      button: {
        pointerEvents: 'none',
        background: 'transparent',
        color: [255, 255, 255, 0.2],
      },
    },
    dim: {
      button: {
        opacity: 0.5,
        '&:hover': {
          opacity: 1,
        },
      },
    },
    material: {
      button: {
        boxShadow: [0, 2, 10, [0, 0, 0, 0.1]],
        '&:hover': {
          boxShadow: [0, 2, 15, [0, 0, 0, 0.15]],
        },
      },
    },
    formed: (a, b, activeTheme) => ({
      button: {
        background: 'red',
        '&:active': activeTheme.active,
        '&:focus': {
          borderColor: '#999',
        },
      },
    }),
  }
}
