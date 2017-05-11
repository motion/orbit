import { clr, view } from '~/helpers'
import Glint from './glint'
import Icon from './icon'

const getColors = (baseColor, strength = 0) => {
  const luminance = baseColor.luminosity()
  const isLight = luminance > 0.7
  const adjuster = isLight ? 'darkenByAmount' : 'lightenByAmount'
  const background = baseColor[adjuster](strength)
  const border = [1, background.darken(isLight ? 0.01 : 0.035)]
  const color = isLight ? background.darken(0.3) : background.lighten(0.3)
  return { background, color, isLight, border }
}

const getBorderedColors = (...args) => {
  const { background } = getColors(...args)
  return {
    color: background,
    border: [1, background.alpha(0.5)],
    background: 'transparent',
  }
}

const RADIUS = 5
const ICON_MARGIN = {
  normal: {
    after: [0, -2, 0, 6],
    before: [0, 6, 0, -2],
  },
  small: {
    after: [0, -2, 0, 4],
    before: [0, 4, 0, -2],
  },
}

@view
export default class Button {
  props: {
    fullwidth: Boolean,
    flex: Number,
    color: String | Function,
  }

  static defaultProps = {
    color: '#777',
  }

  render() {
    const {
      children,
      fullwidth,
      flex,
      sharp,
      icon,
      iconProps,
      iconSize,
      iconAfter,
      end,
      color,
      bordered,
      small,
      large,
      chromeless,
      onClick,
      attach,
      className,
      ...props
    } = this.props

    const theme = clr(color)
    console.log('theme', theme)
    const colors = bordered ? getBorderedColors(theme) : getColors(theme)

    const ButtonIcon = () => (
      <Icon
        if={icon || iconProps}
        name={icon}
        size={iconSize || large ? 18 : small ? 12 : 14}
        margin={
          ICON_MARGIN[small ? 'small' : 'normal'][
            iconAfter ? 'after' : 'before'
          ]
        }
        color={colors.color}
        {...iconProps}
      />
    )

    return (
      <button
        className={className}
        onClick={onClick}
        $fullwidth={fullwidth}
        $flex={flex}
        $sharp={sharp}
        $end={end}
        $bordered={bordered}
        $$style={props}
        {...attach}
      >
        <ButtonIcon if={!iconAfter} />
        {children}
        <ButtonIcon if={iconAfter} />
        <Glint
          /* dark glint doesnt look good */
          if={color.isLight}
          color={[255, 255, 255, 0.3]}
          radius={RADIUS}
        />
      </button>
    )
  }

  static style = {
    button: {
      borderRadius: RADIUS,
      padding: [0, 12],
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 15,
      fontWeight: 400,
      outline: 'none',
      flexFlow: 'row',
      position: 'relative',
      userSelect: 'none',
    },
    sharp: {
      borderRadius: 0,
    },
    flex: {
      flex: 1,
    },
    fullwidth: {
      width: '100%',
    },
    end: {
      alignSelf: 'flex-end',
    },
  }

  static theme = {
    large: {
      button: {
        fontSize: 18,
        padding: [0, 20],
        height: 42,
        borderRadius: 6,
      },
    },
    small: {
      button: {
        fontSize: 13,
        height: 26,
        padding: [0, 8],
      },
    },
    color: ({ color }) => {
      if (color === 'transparent') {
        return {
          button: {
            background: 'transparent',
            border: 'none',
            color: '#777',
          },
        }
      }

      const baseColor = color(color)
      const { isLight, ...regular } = getColors(baseColor)
      const bordered = getBorderedColors(baseColor)
      const borderedLight = bordered.color.lightenByAmount(0.15)

      return {
        button: {
          border: 'none',
          ...regular,
          '&:hover': {
            background: isLight
              ? regular.background.darkenByAmount(0.025)
              : regular.background.lightenByAmount(0.05),
          },
          '&:active': {
            background: regular.background.darkenByAmount(0.08),
          },
        },
        bordered: {
          fontWeight: 300,
          ...bordered,
          '&:hover': {
            borderColor: borderedLight.setAlpha(0.5),
            color: borderedLight,
          },
          '&:active': {
            background: [0, 0, 0, 0.1],
            borderColor: bordered.color.setAlpha(0.5),
            color: bordered.color,
          },
        },
      }
    },
    chromeless: {
      button: {
        background: 'transparent',
        borderColor: 'transparent',
        '&:hover': {
          background: 'transparent',
          borderColor: 'transparent',
        },
        '&:active': {
          background: 'transparent',
          borderColor: 'transparent',
        },
      },
    },
  }
}
