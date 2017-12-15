import marked from 'marked'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'

@view
export default class MarkdownRenderer {
  render({ markdown }) {
    const renderType = {
      table: ({ cells, header }) => {
        return (
          <table style={{ display: 'table' }}>
            <thead>
              <tr>{header.map(col => <th>{col}</th>)}</tr>
            </thead>

            <tbody>
              <tr>{cells.map(tr => tr.map(cell => <td>{cell}</td>))}</tr>
            </tbody>
          </table>
        )
      },
      heading: ({ depth, text }) => {
        let size = 1.2

        if (depth === 1) {
          size = 1.8
        }

        return (
          <UI.Title $h2={depth === 2} fontWeight={600} size={size}>
            {text}
          </UI.Title>
        )
      },
      paragraph: ({ text }) => {
        return (
          <UI.Text>
            {text.split('\n').map(line => (
              <div
                dangerouslySetInnerHTML={{
                  __html: marked.parser(marked.lexer(line)),
                }}
              />
            ))}
          </UI.Text>
        )
      },
    }
    const pieces = marked.lexer(markdown)

    return (
      <markdown>
        {pieces.map(
          piece =>
            renderType[piece.type] ? (
              renderType[piece.type](piece)
            ) : (
              <div>can't render {piece.type}</div>
            )
        )}
      </markdown>
    )
  }

  static style = {
    h2: {
      marginTop: 10,
    },
  }
}
