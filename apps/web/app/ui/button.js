import React from 'react'
import { view, clr } from '~/helpers'
import Icon from './icon'
import Glow from './glow'
import Popover from './popover'
import Circle from './circle'
import type { Color } from 'gloss'
import injectSegmented from './helpers/injectSegmented'

const RADIUS = 5
const idFn = _ => _

@injectSegmented
@view.ui
export default class Button {
  props: {
    segmented?: object,
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
    circleSize?: number,
    iconSize?: number,
  }

  static defaultProps = {
    iconColor: '#999',
    iconSize: 12,
    onClick: idFn,
  }

  uniq = `icon-${Math.round(Math.random() * 1000000)}`

  circleWrapper = (size, props) => children => (
    <Circle size={size} {...props}>{children}</Circle>
  )

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
      circleSize,
      circleProps,
      ...props
    } = this.props

    const hasIconBefore = icon && !iconAfter
    const hasIconAfter = icon && iconAfter
    const wrapper = circular
      ? this.circleWrapper(circleSize, circleProps)
      : idFn

    return (
      <segment
        $color={color}
        $clickable={!!onClick || clickable}
        $activeOn={active}
        $rounding={segmented ? segmented : { first: true, last: true }}
        className={`${className || ''} ${this.uniq}`}
        onClick={onClick}
        {...props}
      >
        {wrapper(
          <wrap>
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
          </wrap>
        )}
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
          showForgiveness
          {...tooltipProps}
        >
          {tooltip}
        </Popover>
      </segment>
    )
  }

  static style = {
    segment: {
      lineHeight: '1rem',
      fontSize: 13,
      fontWeight: 400,
      padding: [0, 10],
      height: 30,
      alignItems: 'center',
      flexFlow: 'row',
      justifyContent: 'center',
      borderColor: '#ddd',
      borderWidth: 1,
      borderStyle: 'dotted',
      borderRightWidth: 0,
      position: 'relative',
    },
    color: color => ({
      color,
    }),
    rounding: ({ first, last }) => ({
      ...(first && {
        borderTopLeftRadius: RADIUS,
        borderBottomLeftRadius: RADIUS,
      }),
      ...(last && {
        borderRightWidth: 1,
        borderTopRightRadius: RADIUS,
        borderBottomRightRadius: RADIUS,
      }),
    }),
    wrap: {
      // flex: 1,
      flexFlow: 'row',
      alignItems: 'center',
    },
    clickable: {
      cursor: 'pointer',
    },
    activeOn: {
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
        segment: {
          ...activeTheme.base,
          '&:active': activeTheme.active,
          '&:hover': activeTheme.hover,
        },
        activeOn: {
          ...activeTheme.active,
          '&:hover': activeTheme.active,
        },
        clickable: {
          '&:active': activeTheme,
          '&:hover': {
            background: activeTheme.background,
          },
        },
      }
    },
    spaced: {
      segment: {
        borderRadius: 5,
        margin: [0, 2],
        borderRightWidth: 1,
      },
    },
    stretch: {
      segment: {
        flex: 1,
      },
    },
    circular: {
      segment: {
        borderWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
      },
    },
    chromeless: {
      segment: {
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
      segment: {
        pointerEvents: 'none',
        background: 'transparent',
        color: [255, 255, 255, 0.2],
      },
    },
    dim: {
      segment: {
        opacity: 0.5,
        '&:hover': {
          opacity: 1,
        },
      },
    },
  }
}
