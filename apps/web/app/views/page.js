import { $, view } from '~/helpers'
import Router from '~/router'
import { Document } from 'models'
import Commander from '~/views/commander'

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
        <children>
          {children}
        </children>
        <statusbar>
          <omnibar>
            <Commander $omniinput />
          </omnibar>
          <form
            if={false}
            onSubmit={e => {
              e.preventDefault()
              Document.create({ title: this.newDoc.value })
              this.newDoc.value = ''
            }}
          >
            <input
              $create
              ref={this.ref('newDoc').set}
              placeholder="create doc (#tag to tag) (/ to search)"
            />
          </form>

          <view $$row $$flex>
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
            <view if={doc} $$row>
              members: {(doc.members || []).join(', ')}
            </view>
          </view>
        </statusbar>
      </page>
    )
  }

  static style = {
    page: {
      flex: 1,
    },
    children: {
      flex: 1,
      overflowY: 'scroll',
    },
    statusbar: {
      flexWrap: 'nowrap',
      overflow: 'hidden',
      padding: 10,
      background: '#fff',
      position: 'relative',
    },
    tag: {
      padding: [2, 5],
      background: '#fff',
      color: 'red',
      '&:hover': {
        background: '#eee',
      },
    },
    form: {
      width: '100%',
      padding: 10,
    },
    create: {
      width: '100%',
      padding: [8, 7],
      fontSize: 16,
      background: '#fff',
      border: [1, '#ddd'],
    },
  }
}

Page.Side = $('side', {
  width: 200,
  padding: 0,
  flex: 1,
})

Page.Head = $('header', {})
