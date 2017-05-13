import { view } from '~/helpers'

@view
export default class Input {
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
        margin: [-6, -10],
        padding: [6, 10],
        fontSize: 14,
        '&:focus': {
          // invisible
          borderColor: 'rgba(0,0,0,0)',
        },
      },
    },
  }
}
