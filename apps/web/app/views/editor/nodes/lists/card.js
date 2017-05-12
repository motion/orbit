import { view } from '~/helpers'
import randomcolor from 'random-color'

@view
export default class CardList {
  render({ listStore }) {
    return (
      <docs $stack={true} if={listStore.docs}>
        {listStore.docs.map((doc, i) => (
          <doc
            $$background={`
                linear-gradient(
                  ${Math.floor(Math.random() * 180)}deg,
                  pink,
                  red
                )
              `}
            $first={i === 0}
            key={doc._id}
            onClick={() => Router.go(doc.url())}
          >
            <card $$title>
              {doc.getTitle()}
            </card>
          </doc>
        ))}
      </docs>
    )
  }
  static style = {
    docs: {
      flexFlow: 'row',
      overflowX: 'scroll',
      padding: 10,
      margin: [0, -10],
    },
    doc: {
      margin: [0, 10, 0, 0],
      userSelect: 'none',
      width: 150,
      height: 150,
      borderBottom: [1, '#eee'],
      color: '#fff',
      fontWeight: 800,
      cursor: 'pointer',
      fontSize: 46,
      lineHeight: '3rem',
      overflow: 'hidden',
      '&:hover': {
        boxShadow: '0 0 10px rgba(0,0,0,0.02)',
        zIndex: 1000,
        transform: 'rotate(-3deg)',
      },
    },
    card: {
      // background: '#fff',
      width: '100%',
      height: '100%',
    },
    stack: {
      flexFlow: 'row',
    },
  }
}
