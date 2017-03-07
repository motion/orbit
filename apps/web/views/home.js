import { view, glossy as $ } from 'helpers'
import { Title, Page, Date } from 'views'
import Letter from './letter'

const Dot = $('dot', { margin: [0, 10] })
const DOT = <Dot>&middot;</Dot>

const Comment = $('comment', {
  padding: [5, 10],
  flexFlow: 'row',
  whiteSpace: 'pre',
})

const COMMENT = () =>
  <Comment>
    <span $$opacity={0.2}>
      💬
    </span>
    &nbsp;
    {Math.round(Math.random() * 20)}
  </Comment>

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
