import { view } from 'helpers'
import rc from 'randomcolor'

const SIZE = 10

@view
export default class Letter {
  render({ children: letter }) {
    return (
      <circ key={letter}>
        <let>
          <letter $top>{letter}</letter>
          <letter $bottom={[rc(letter.charCodeAt), rc(letter.charCodeAt+1)]}>{letter}</letter>
          <letter $three={rc(letter.charCodeAt)}>{letter}</letter>
        </let>
      </circ>
    )
  }

  static style = {
    circ: {
      width: `${SIZE* 1.1}rem`,
      height: `${SIZE* 1.1}rem`,
      background: '#fff',
      cursor: 'pointer',
    },
    let: {
      fontSize: `${SIZE}rem`,
      lineHeight: `${SIZE}rem`,
      fontFamily: 'Hensa',
      position: 'relative',
      margin: 'auto',
    },
    letter: {
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '-10%',
    },
    top: {
      background: 'radial-gradient(ellipse farthest-side at top right, transparent 0%, transparent 28%, white 28%, white 30%, transparent 30%, transparent 76%, white 76%, white 77%, transparent 77%, transparent 100%)',
      position: 'absolute',
      top: 0, left: 0,
      opacity: 1,
      zIndex: 100,
    },
    bottom: ([color, color2]) => ({
      background: `radial-gradient(at center, ${color} 70%, ${color2} 10%)`,
    }),
    three: {
      // background: 'linear-gradient(white 20%, purple 40%, green 80%)',
      position: 'absolute',
      top: 0, left: 0,
      opacity: 0.5,
    },
  }
}
