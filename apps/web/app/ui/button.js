// @flow
import React from 'react'
import { view } from '@jot/black'
import { inject, clr } from '~/helpers'
import Icon from './icon'
import Glow from './effects/glow'
import Popover from './popover'
import type { Color } from 'gloss'

const idFn = _ => _

export type Props = {
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
  size?: number,
  iconSize?: number,
  padding?: number | Array<number>,
  margin?: number | Array<number>,
  height?: number,
  noGlow?: boolean,
}

@inject(context => context.ui)
@view.ui
export default class Button {
  props: Props

  static defaultProps = {
    onClick: idFn,
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
    tooltip,
    tooltipProps,
    className,
    theme,
    circular,
    size,
    borderRadius,
    material,
    padding,
    height,
    margin,
    noGlow,
    hoverColor,
    ...props
  }: Props) {
    const hasIconBefore = icon && !iconAfter
    const hasIconAfter = icon && iconAfter
    const stringIcon = typeof icon === 'string'

    const iconSize = _iconSize || size * 16

    return (
      <button
        $inSegment={inSegment && this.props}
        $clickable={!!onClick || clickable}
        $isActive={active}
        $highlight={highlight}
        className={`${className || ''} ${this.uniq}`}
        onClick={onClick}
        {...props}
      >
        <icon if={icon && !stringIcon} $iconAfter={hasIconAfter}>
          {icon}
        </icon>
        <Icon
          if={icon && stringIcon}
          $icon
          $iconAfter={hasIconAfter}
          name={icon}
          size={iconSize}
          color={highlight ? 'blue' : active ? '#000' : color || iconColor}
          {...iconProps}
        />
        <glowWrap if={!noGlow} $minimal={chromeless}>
          <Glow full scale={2} color={[0, 0, 0]} opacity={0.06} />
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
          delay={100}
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
      alignItems: 'center',
      flexFlow: 'row',
      justifyContent: 'center',
      border: [1, '#f5f5f5'],
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
      boxShadow: ['inset 0 1px 0 rgba(255,255,255,0.5)', ',inset 0 -1px 0 red'],
    },
    minimal: {
      boxShadow: 'none',
    },
    inSegment: ({
      chromeless,
      borderRadius,
      circular,
      inSegment,
      inSegment: { first, last },
    }) => ({
      ...(inSegment && {
        marginLeft: -1,
      }),
      ...(first && {
        borderLeftRadius: circular ? 1000 : borderRadius,
      }),
      ...(last && {
        borderRightRadius: circular ? 1000 : borderRadius,
      }),
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
    theme: (props: Props, context, theme) => {
      //
      // TODO this is a great way to do our entire ui kit:
      //
      // const $ = props => themeProps(getProps(props, CSS_PROPS), theme)
      //

      // based on a vertical rythm
      const height = props.size * 30

      return {
        // $FlowIgnore
        button: {
          // ...$(props, theme),
          ...theme.base,
          padding: props.padding || [0, height / 10],
          height,
          borderRadius: props.inSegment
            ? null
            : props.borderRadius || height / 10,
          color: props.highlight
            ? props.highlightColor || theme.highlight.color || props.color
            : props.color || theme.base.color,
          background: props.background,
          ...(props.circular && {
            padding: 0,
            borderRadius: height,
            width: height,
          }),
          '&:active': {
            position: 'relative',
            zIndex: 1000,
          },
          '&:hover': {
            ...theme.hover,
            color: props.hoverColor || theme.hover.color,
          },
          // inForm
          ...(props.inForm && {
            '&:active': theme.active,
            '&:focus': theme.focus,
          }),
          // inline
          ...(props.inline && {
            border: [1, 'solid', 'transparent'],
            '&:hover': {
              border: [1, 'solid', theme.hover.borderColor],
            },
          }),
        },
        isActive: {
          background: '#f2f2f2',
        },
        clickable: {
          '&:hover': {
            background: theme.background,
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
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        '&:hover': {
          opacity: 0.8,
        },
      },
      isActive: {
        background: [0, 0, 0, 0.1],
        '&:hover': {
          background: [0, 0, 0, 0.2],
        },
      },
    },
    inline: {
      button: {
        background: 'transparent',
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        margin: [-2, -3],
        maxHeight: '1.45rem',
        borderRadius: 1000,
      },
    },
    disabled: {
      button: {
        opacity: 0.25,
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
