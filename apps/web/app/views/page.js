import { $, view } from '~/helpers'
import Router from '~/router'

@view
export class Page {
  id = Math.random()

  componentWillMount() {
    this.setViews(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setViews(nextProps)
  }

  componentWillUnmount() {
    // ensure removal only if not already replaced
    if (App.views._id === this.id) {
      App.views = {}
    }
  }

  setViews = props => {
    const { title, actions, header, sidebar } = props
    App.views = { _id: this.id, title, actions, header, sidebar }
  }

  render({ children, className, doc }) {
    return (
      <page className={className}>
        <children $$flex>
          {children}
        </children>
        <statusbar>
          <statsec $$row $$flex>
            {`#all #btc #etherium #monero #day-trading #something`
              .split(' ')
              .map(tag => (
                <a
                  $tag
                  key={tag}
                  onClick={() => Router.set('hashtag', tag.slice(1))}
                >
                  {tag}
                </a>
              ))}
          </statsec>
          <statsec if={doc} $$row>
            members: {(doc.members || []).join(', ')}
          </statsec>
        </statusbar>
      </page>
    )
  }

  static style = {
    page: {
      flex: 1,
      overrflowY: 'scroll',
    },
    statusbar: {
      flexFlow: 'row',
      flexWrap: 'nowrap',
      overflow: 'hidden',
      padding: 10,
    },
    tag: {
      padding: [2, 5],
      background: '#fff',
      color: 'red',
      '&:hover': {
        background: '#eee',
      },
    },
  }
}

Page.Side = $('side', {
  width: 200,
  padding: 0,
  flex: 1,
})

Page.Head = $('header', {})
