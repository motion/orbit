import React from 'react'
import { view, clr } from '~/helpers'
import Icon from './icon'
import Glow from './glow'
import Popover from './popover'

const Theme = {
  color: {
    darkBackground: clr('#333'),
    darkBorder: clr('#111'),
    secondary: clr('#444'),
  },
}

const activeLight = {
  background: '#eee',
  color: '#444',
  '&:hover': {
    background: '#eee',
    color: '#444',
  },
}

const RADIUS = 5

const activeDark = {
  background: Theme.color.darkBackground.darken(0.05),
  boxShadow: ['inset', 0, 1, 0, [255, 255, 255, 0.02]],
  color: '#fff',
  opacity: 1,
  '&:hover': {
    background: Theme.color.darkBackground.darken(0.07),
    color: '#fff',
    opacity: 1,
  },
}

const getColors = (baseColor, strength = 0) => {
  const luminance = baseColor.luminosity()
  const isLight = luminance > 0.7
  const background = baseColor.lighten(strength)
  const color = background.lightness(isLight ? 0.3 : 1)
  return { background, color, isLight }
}

@view
export default class SegmentItem {
  static isSegment = true
  static defaultProps = {
    iconColor: '#888',
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
      slim,
      tiny,
      dark,
      iconAfter,
      dim,
      stretch,
      tooltip,
      tooltipProps,
      className,
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
          size={iconSize || 12}
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
          dark
          bg
          openOnHover
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
      padding: [5, 10],
      alignItems: 'center',
      flexFlow: 'row',
      justifyContent: 'center',
      color: '#444',
      borderColor: '#eee',
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
      '&:active': activeLight,
    },
    activeOn: activeLight,
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
    spaced: {
      segment: {
        borderRadius: 5,
        margin: [0, 2],
        borderRightWidth: 1,
      },
    },
    slim: {
      segment: {
        padding: [5, 10],
        fontSize: 12,
      },
      icon: {
        transform: 'scale(0.9)',
      },
    },
    tiny: {
      segment: {
        height: 24,
        padding: [3, 8],
      },
    },
    stretch: {
      segment: {
        flex: 1,
      },
    },
    chromeless: {
      segment: {
        border: 'transparent',
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
    dark: {
      segment: {
        borderColor: Theme.color.darkBorder,
        background: `
          ${Theme.color.darkBackground.lighten(0.025).rgb()}
          linear-gradient(
            rgba(255,255,255,0.02),
            transparent
          )
        `,
        boxShadow: ['inset', 1, -1, 0, [255, 255, 255, 0.025]],
        color: [255, 255, 255, 1],
        '&:active': activeDark,
      },
      activeOn: activeDark,
      clickable: {
        '&:active': activeDark,
        '&:hover': {
          background: `
            ${Theme.color.darkBackground.lighten(0.05).rgb()}
            linear-gradient(
              rgba(255,255,255,0.035),
              transparent
            )
          `,
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
    color: ({ color }) => {
      if (color === 'transparent') {
        return {
          button: {
            background: 'transparent',
            border: 'none',
            color: Theme.color.secondary,
          },
        }
      }

      const base = clr(color)
      const { isLight, ...regular } = getColors(base)

      return {
        segment: {
          ...regular,
          '&:hover': {
            background: isLight
              ? regular.background.darken(0.025)
              : regular.background.lighten(0.05),
          },
          '&:active': {
            background: regular.background.darken(0.08),
          },
        },
      }
    },
  }
}
