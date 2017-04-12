import { view, store } from 'helpers'
import { Title, Text, Page, Link } from 'views'
import { Hero, Piece } from 'models'

@view.provide(() => ({
  store: store({
    x: 4,
    pieces: Piece.all(),
    insert(author, content) {
      Piece.table.insert({ id: ''+Math.random(), author, content })
    },
    async delete(name) {
      const [doc] = await Piece.table.find({ name }).exec()
      if (doc) {
        doc.remove()
      }
    }
  })
}))
export default class Projects {
  addPiece = () => this.props.store.insert(this.author.value, this.content.value)

  render({ store }) {
    return (
      <Page $page>
        <half>
          create piece

          author <input ref={x => this.author = x} />
          content <textarea ref={x => this.content = x} />
          <button onClick={this.addPiece}>
            insert hero22
          </button>

          {(store.pieces.current || []).map(piece =>
            <piece key={Math.random()}>
              author: {piece.author || 'none'}<br />
              content: {piece.content || 'none'}<br />
              <button onClick={() => store.delete(piece._id)}>x</button>
            </piece>
          )}
        </half>
      </Page>
    )
  }

  static style = {
    page: {
      flexFlow: 'row',
    },
    half: {
      flex: 1,
    }
  }
}

