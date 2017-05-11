import { $, view } from '~/helpers'
import Sidebar from '~/views/layout/sidebar'
import Popover from '~/views/popover'

export * from '~/views/page'

@view
export class Input {
  render({ children, noBorder, getRef, ...props }) {
    return <input ref={getRef} {...props} />
  }

  static style = {
    input: {
      fontSize: 16,
      lineHeight: '1.4rem',
      border: [1, '#eee'],
      padding: [3, 5],
      margin: ['auto', 0],
      background: '#fff',
      '&:hover': {
        cursor: 'text',
      },
      '&:focus': {
        border: [1, 'blue'],
      },
    },
  }

  static theme = {
    noBorder: {
      input: {
        '&:focus': {
          // invisible
          borderColor: 'rgba(0,0,0,0)',
        },
      },
    },
  }
}

@view
export class Button {
  uniq = `icon-${Math.round(Math.random() * 1000000)}`

  render({ children, className, tooltip, tooltipProps, ...props }) {
    return (
      <btn className={`${className || ''} ${this.uniq}`} {...props}>
        {children}
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
  }
}

@view
export class CircleButton {
  render({ icon, children, ...props }) {
    return (
      <Circle {...props}>
        <icon if={icon}>{icon}</icon>
        <children if={children}>{children}</children>
      </Circle>
    )
  }
  static style = {
    icon: {
      fontSize: 18,
      lineHeight: '1.4rem',
      height: 20,
    },
    children: {
      fontSize: 9,
      height: 7,
      opacity: 0.5,
      lineHeight: '0.6rem',
    },
  }
}

export const Circle = $('btn', {
  display: 'flex',
  fontSize: 30,
  width: 45,
  height: 45,
  borderRadius: 100,
  lineHeight: '1rem',
  border: [2, '#eee'],
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  background: '#fff',
  color: '#111',
  fontWeight: 400,
  cursor: 'pointer',
  filter: 'grayscale(100%)',
  userSelect: 'none',
  opacity: 0.8,
  '&:hover': {
    opacity: 1,
    borderWidth: 1,
    color: '#000',
    filter: 'grayscale(0%)',
    transform: {
      scale: 1.02,
    },
  },
})

export const Text = $('p', {
  fontSize: 16,
  lineHeight: '1.6rem',
  display: 'block',
})

export const Quote = $('blockquote', {
  borderLeft: [2, '#eee'],
  padding: [5, 10],
  margin: 10,
})

export const Date = $('date', {
  color: '#999',
})
