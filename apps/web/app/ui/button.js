import React from 'react'
import { view, clr } from '~/helpers'
import Icon from './icon'
import Glow from './glow'
import Popover from './popover'

const RADIUS = 5

@view.ui
export default class Button {
  static isSegment = true
  static defaultProps = {
    iconColor: '#999',
    iconSize: 12,
  }

  uniq = `icon-${Math.round(Math.random() * 1000000)}`

  render() {
    const {
      segmented,
      first,
      last,
      seg,
      onChange,
      onClick,
      clickable,
      children,
      icon,
      iconProps,
      iconSize,
      iconColor,
      color,
      active,
      spaced,
      after,
      chromeless,
      dark,
      iconAfter,
      dim,
      stretch,
      tooltip,
      tooltipProps,
      className,
      theme,
      ...props
    } = this.props

    const hasIconBefore = icon && !iconAfter
    const hasIconAfter = icon && iconAfter

    return (
      <segment
        key={seg}
        $hasIconBefore={hasIconBefore}
        $hasIconAfter={hasIconAfter}
        $first={!segmented || (!spaced && first)}
        $last={!segmented || (!spaced && last)}
        $clickable={onClick || clickable}
        $activeOn={active}
        className={`${className || ''} ${this.uniq}`}
        onClick={e => {
          if (onClick) onClick(e)
          if (onChange) onChange(seg)
        }}
        {...props}
      >
        <Icon
          if={icon}
          $icon
          $iconAfter={hasIconAfter}
          name={icon}
          size={iconSize}
          color={color || iconColor}
          {...iconProps}
        />
        <children if={children} style={{ color }}>
          <glowWrap if={!active}>
            <Glow full scale={0.7} color={[0, 0, 0]} opacity={0.04} />
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
      </segment>
    )
  }

  static style = {
    segment: {
      lineHeight: '1rem',
      fontSize: 13,
      fontWeight: 400,
      padding: [0, 10],
      height: 31,
      alignItems: 'center',
      flexFlow: 'row',
      justifyContent: 'center',
      color: '#444',
      borderColor: '#ddd',
      borderWidth: 1,
      borderStyle: 'dotted',
      borderRightWidth: 0,
      position: 'relative',
    },
    clickable: {
      cursor: 'pointer',
      '&:hover': {
        background: '#fefefe',
      },
    },
    activeOn: {
      background: '#fafafa',
    },
    children: {
      userSelect: 'none',
    },
    glowWrap: {
      position: 'absolute',
      overflow: 'hidden',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10,
      borderRadius: RADIUS,
    },
    first: {
      borderTopLeftRadius: RADIUS,
      borderBottomLeftRadius: RADIUS,
    },
    last: {
      borderRightWidth: 1,
      borderTopRightRadius: RADIUS,
      borderBottomRightRadius: RADIUS,
    },
    hasIconBefore: {
      '& children': {
        marginLeft: 3,
      },
    },
    hasIconAfter: {
      '& children': {
        marginRight: 3,
      },
    },
    iconAfter: {
      order: 3,
    },
  }

  static theme = {
    theme: (props, context, activeTheme) => ({
      segment: {
        ...activeTheme,
        '&:active': activeTheme,
      },
      activeOn: activeTheme,
      clickable: {
        '&:active': activeTheme,
        '&:hover': {
          background: activeTheme.background,
        },
      },
    }),
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
    chromeless: {
      segment: {
        borderWidth: 0,
        '&:hover': {
          opacity: 0.8,
        },
      },
      last: {
        borderRightWidth: 0,
      },
      first: {
        borderLeftWidth: 0,
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
