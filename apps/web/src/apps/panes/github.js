import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import PaneCard from './views/card'

const changes = [
  {
    contents: `
content: (
  <PaneCard
    title="Product Page Planning Meeting"
    icon="google"
)
`,
    type: 'addition',
  },
  {
    contents: `
this.children &&
this.children.map(doc => {
  return {
    type: 'browse',
    title: doc.title,
    category: 'Browse',
    icon: doc.icon,
    doc,
  }
})
)
`,
    type: 'deletion',
  },
]

@view
export default class BarDocPane {
  render({ data, highlightIndex, activeIndex, paneProps }) {
    return (
      <PaneCard title={data.title} icon="github" id={data.id || 0}>
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
              <code>
                <pre>
                  <UI.Text>
                    {change.contents}
                  </UI.Text>
                </pre>
              </code>
            </change>
          )
        })}
      </PaneCard>
    )
  }

  static style = {}
}
