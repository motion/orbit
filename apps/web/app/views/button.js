import { clr, view } from '~/helpers'
import Icon from './icon'

@view
export default class Button {
  uniq = `icon-${Math.round(Math.random() * 1000000)}`

  render({ children, icon, className, tooltip, tooltipProps, ...props }) {
    return (
      <btn $$row className={`${className || ''} ${this.uniq}`} {...props}>
        <Icon $icon if={icon} name={icon} />
        <children if={children}>
          {children}
        </children>
        <Popover
          if={tooltip}
          dark
          bg
          openOnHover
          noHover
          target={`.${this.uniq}`}
          padding={[0, 5]}
          distance={10}
          {...tooltipProps}
        >
          {tooltip}
        </Popover>
      </btn>
    )
  }
  static style = {
    btn: {
      padding: [2, 8],
      borderRadius: 100,
      border: [1, 'dotted', '#eee'],
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff',
      color: '#000',
      fontSize: 14,
      cursor: 'pointer',
      userSelect: 'none',
      '&:hover': {
        background: '#f2f2f2',
      },
      '&:active': {
        background: '#eee',
      },
    },
    icon: {
      marginRight: 3,
    },
  }
}
