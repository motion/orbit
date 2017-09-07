// @flow
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Pane from './pane'

const changes = [
  {
    contents:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam similique veritatis...',
    type: 'addition',
  },
  {
    contents: 'Consectetur adipisicing elit. Veniam similique veritatis...',
    type: 'deletion',
  },
  {
    contents: 'Veniam similique veritatis...',
    type: 'addition',
  },
]

@view
export default class BarDocPane {
  render({ data, highlightIndex, activeIndex, paneProps, ...props }) {
    return (
      <Pane.Card title={data.title} icon="google" id={data.id || 0} {...props}>
        <what css={{ padding: [5, 5, 5] }}>
          <UI.Text>
            {data.author} made{' '}
            <span css={{ color: 'green' }}>
              <strong>2</strong> additions
            </span>{' '}
            and{' '}
            <span css={{ color: 'red' }}>
              <strong>1</strong> deletion
            </span>:
          </UI.Text>
        </what>

        {changes.map((change, index) => {
          const add = change.type === 'addition'
          return (
            <change key={index} css={{ flexFlow: 'row', marginBottom: 5 }}>
              <icon css={{ padding: [0, 8], color: add ? 'green' : 'red' }}>
                {add ? '+' : '-'}
              </icon>
              <UI.Text>
                {change.contents}
              </UI.Text>
            </change>
          )
        })}
      </Pane.Card>
    )
  }

  static style = {}
}
