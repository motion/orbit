export Link from './link'
export List from './list'
export Title from './title'
export Modal from './modal'
export Poof from './poof'
export Icon from './icon'
export Input from './input'
export Loading from './loading'
export Grid from './grid'
export Segment from './segment'
export Button from './button'
export Popover from './popover'
export Glow from './glow'
export ContextMenu from './contextMenu'
export Pane from './pane'
export Tabs from './tabs'

import { $, view } from '~/helpers'

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
