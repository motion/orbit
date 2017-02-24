import { view, glossy } from 'helpers'
import { Title, Page, Date } from 'views'
import rc from 'randomcolor'

const Dot = glossy('dot', { margin: [0, 10] })
const DOT = <Dot>&middot;</Dot>

const Comment = glossy('comment', { padding: [5, 10], flexFlow: 'row', whiteSpace: 'pre' })
const COMMENT = () => <Comment><span $$opacity={0.2}>💬</span>&nbsp;{Math.round(Math.random() * 20)}</Comment>

const SIZE = 10

@view
class Letter {
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
    page: {
      flexFlow: 'row',
      flexWrap: 'wrap',
    },
    item: {
      padding: 10,
      marginBottom: 15,
      flexFlow: 'row',
    },
    post: {
      width: '80%',
    },
    comments: {
      paddingTop: 75,
      width: '20%',
    },
    feed: {
      padding: [20, 0],
    },
    title: {
      color: '#999',
      margin: [0, 10],
    },
    small: {
      fontSize: 12,
      margin: [3, 0, -3, 10],
      opacity: 0.3,
    },
    via: {
      fontSize: 12,
      margin: [0, 0, 5],
    },
    img: {
      width: 12,
      height: 12,
      marginRight: 5,
    },
    dot: {
      margin: [0, 10],
      color: '#999',
    },
    a: {
      display: 'flex',
      flexFlow: 'row',
      alignItems: 'center',
      fontWeight: 500,
      color: '#999'
    },
    nav: {
      flexFlow: 'row'
    }
  }
}

@view
export default class Home {
  render() {
    return (
      <cards>
        <card>
          <Letter>M</Letter>
          <sub>Motion</sub>
          <desc>
            run js apps
          </desc>
        </card>

        <card>
          <Letter>P</Letter>
          <sub>Pundle</sub>
          <desc>
            next gen js bundler
          </desc>
        </card>

        <card>
          <Letter>G</Letter>
          <sub>Gloss</sub>
          <desc>
            easy css in js
          </desc>
        </card>

        <card>
          <Letter>S</Letter>
          <sub>Starter</sub>
          <desc>
            starter kit with RethinkDB, Horizon,
            Mobx, Gloss, and all Motion utils, dockerized.
          </desc>
        </card>

        <card>
          <Letter>R</Letter>
          <sub>Repoman</sub>
          <desc>
            Develop open source tools with sanity. Manage all your repos.
          </desc>
        </card>

        <card>
          <Letter>H</Letter>
          <sub>HoverGlow</sub>
          <desc>
            glows that hover
          </desc>
        </card>

        <card>
          <Letter>*</Letter>
          <sub>*</sub>
          <desc>
            motion is good
          </desc>
        </card>
      </cards>
    )
  }

  static style = {
    cards: {
      flexFlow: 'row',
      flexWrap: 'wrap',
    },
    card: {
      border: [1, '#eee'],
      padding: 18,
      width: 220,
      margin: 10,
    },
    sub: {
      fontSize: 18,
      fontWeight: 600,
    },
    desc: {
      fontSize: 16,
    },
  }
}
