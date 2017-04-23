import { $, view } from '~/helpers'
import Sidebar from '~/views/layout/sidebar'

export const Input = $('input', {
  border: [1, '#eee'],
  padding: 4,
  margin: ['auto', 4],
  background: '#fff',
})

export const Button = $('btn', {
  padding: [2, 8],
  borderRadius: 100,
  border: [1, '#eee'],
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fff',
  color: '#000',
  fontSize: 14,
  cursor: 'pointer',
})

export const CircleButton = $('btn', {
  display: 'flex',
  position: 'absolute',
  top: -5,
  left: -5,
  width: 40,
  height: 40,
  borderRadius: 100,
  border: [2, '#eee'],
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  background: '#fff',
  color: '#111',
  fontSize: 20,
  fontWeight: 400,
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'all ease-in 100ms',
  '&:hover': {
    background: '#B535C4',
    color: '#fff',
    transform: {
      scale: 1.2,
    },
  },
})

@view
export class Page {
  render({ children, header, ...props }) {
    return (
      <pagemain {...props}>
        <header if={header}>
          {header}
        </header>
        {children}
      </pagemain>
    )
  }
  static style = {
    pagemain: {
      padding: 10,
      flex: 1,
      position: 'relative',
      overflowY: 'scroll',
    },
  }
}

Page.Side = $('side', {
  width: 200,
  padding: 0,
  flex: 1,
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
