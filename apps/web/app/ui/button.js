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
    inSegment?: object,
    inForm?: boolean,
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
    borderRadius: 5,
  }

  uniq = `icon-${Math.round(Math.random() * 1000000)}`

  render() {
    const {
      inSegment,
      inForm,
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
      ...props
    } = this.props

    const hasIconBefore = icon && !iconAfter
    const hasIconAfter = icon && iconAfter

    return (
      <button
        $$borderRadius={borderRadius}
        $inSegment={inSegment && this.props}
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
        <glowWrap if={!active}>
          <Glow full scale={2} color={[0, 0, 0]} opacity={0.08} />
        </glowWrap>
        <children
          if={children}
          $hasIconBefore={hasIconBefore}
          $hasIconAfter={hasIconAfter}
          style={{ color }}
        >
          {children}
        </children>
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
      border: [1, '#eee', 'dotted'],
      position: 'relative',
      // '&:active': {
      //   borderColor: 'blue',
      // },
    },
    inSegment: ({
      chromeless,
      borderRadius,
      circular,
      inSegment: { first, last },
    }) => ({
      borderRightWidth: chromeless ? 0 : 1,
      borderLeftWidth: 0,
      ...(first && {
        borderLeftRadius: circular ? 1000 : borderRadius,
        borderLeftWidth: chromeless ? 0 : 1,
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
    theme: (
      { inForm, inSegment, borderRadius, circular },
      context,
      activeTheme
    ) => {
      return {
        button: {
          ...(!inSegment && {
            borderRadius,
          }),
          ...(circular && {
            borderRadius: 1000,
          }),
          ...activeTheme.base,
          '&:hover': activeTheme.hover,
          // inForm
          ...(inForm && {
            '&:active': activeTheme.active,
            '&:focus': {
              borderColor: '#999',
              borderWidth: 1, // ;)
            },
          }),
        },
        isActive: {
          background: '#f2f2f2',
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
        background: 'transparent',
        borderWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0,
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
  }
}
