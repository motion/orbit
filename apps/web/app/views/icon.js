import { view } from '~/helpers'
import Popover from './popover'
import names from './iconNames'
import fuzzy from 'fuzzy'

const memory = {}

const findMatch = (name: string) => {
  if (memory[name]) return memory[name]
  if (names[name]) return names[name]
  const matches = fuzzy.filter(name, names)
  const match = matches.length ? matches[0].original : names[0]
  memory[name] = match
  return match
}

@view
export default class Icon {
  props: {
    size: number,
    color: Array | string,
    type: string,
  }

  static defaultProps = {
    size: 16,
    color: [255, 255, 255, 0.4],
    // hoverColor: [255,255,255,0.7],
    type: 'mini',
    margin: 0,
  }

  uniq = `icon-${Math.round(Math.random() * 1000000)}`

  render() {
    const {
      color,
      hoverColor,
      size,
      tooltip,
      tooltipProps,
      name,
      type,
      className,
      onClick,
      attach,
      children,
      ...props
    } = this.props

    const iconName = findMatch(name)

    return (
      <icon
        className={`${className || ''} ${this.uniq}`}
        $$style={props}
        onClick={onClick}
        {...attach}
      >
        <inner className={`nc-icon-${type} ${iconName}`}>
          {children}
        </inner>
        <Popover
          if={tooltip}
          dark
          bg
          openOnHover
          noArrow
          noHover
          target={`.${this.uniq}`}
          padding={[0, 5]}
          distance={10}
          towards="top"
          {...tooltipProps}
        >
          {tooltip}
        </Popover>
      </icon>
    )
  }

  static style = {
    icon: {
      alignItems: 'center',
    },
    inner: {
      margin: 'auto',
      textRendering: 'geometricPrecision',
    },
  }

  static theme = {
    color: ({ color }) => ({
      icon: {
        color,
      },
    }),
    hoverColor: ({ hoverColor }) => ({
      icon: {
        '&:hover': {
          color: hoverColor,
        },
      },
    }),
    size: ({ size, width, height }) => {
      return {
        icon: {
          width: width || size + 5,
          height: height || size + 5,
          fontSize: size,
          lineHeight: `${size / 12 - 0.1}rem`, // scale where 1 when 14
        },
      }
    },
  }
}
