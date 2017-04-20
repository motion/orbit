import { view, $ } from '~/helpers'
import Router from '~/router'

@view
export class Link {
  onClick = e => {
    e.preventDefault()
    Router.go(this.props.to)
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }
  render({ to, ...props }) {
    return <a href={to} {...props} onClick={this.onClick} />
  }
  static style = {
    a: {
      color: 'purple',
    },
  }
}

export const CircleButton = $('a', {
  display: 'flex',
  position: 'absolute',
  top: -20,
  left: -25,
  width: 40,
  height: 40,
  borderRadius: 100,
  border: [1, 'transparent'],
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  background: 'purple',
  color: '#fff',
  fontSize: 50,
  fontWeight: 100,
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'all ease-in 100ms',
  '&:hover': {
    background: '#B535C4',
    transform: {
      scale: 1.2,
    },
  },
})

export const Page = $('section', {
  padding: 10,
  flexFlow: 'row',
})

Page.Main = $('section', {
  padding: 10,
  minWidth: '70%',
  flex: 1,
  position: 'relative',
})

Page.Side = $('section', {
  padding: 10,
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

export Title from './title'
export Poof from './poof'
