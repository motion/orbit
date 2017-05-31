import { view } from '~/helpers'

@view
export default class Circle {
  static defaultProps = {
    size: 45,
  }

  render({ size, ...props }) {
    return <circle {...props} />
  }

  static style = {
    circle: {
      display: 'flex',
      fontSize: 30,
      borderRadius: 100,
      lineHeight: '1rem',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      background: '#fff',
      boxShadow: [0, 4, 15, [0, 0, 0, 0.125]],
      color: '#111',
      fontWeight: 400,
      cursor: 'pointer',
      userSelect: 'none',
      transition: 'all ease-in 100ms',

      '&:hover': {
        boxShadow: [0, 4, 25, [0, 0, 0, 0.2]],
        background: '#efefef',
        transform: {
          scale: '1.2',
        },
      },
    },
  }

  static theme = {
    size: ({ size }) => ({
      circle: {
        width: size,
        height: size,
      },
    }),
  }
}
