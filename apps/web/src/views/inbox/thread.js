import { view } from '@mcro/black'
import { Thread, Document } from '@mcro/models'
import * as UI from '@mcro/ui'
import Message from './message'
import { sortBy, capitalize } from 'lodash'
import timeAgo from 'time-ago'
import Draft from './draft'

const { ago } = timeAgo()

class ThreadStore {
  docs = Document.forThread(this.props.document.threadId)
  showReply = false

  assignTo = name => {
    const { document } = this.props

    document.addUpdate({ type: 'assign', to: name })
    document.save()
  }

  addTag = name => {
    const { document } = this.props

    document.addUpdate({ type: 'tag', name })
    document.save()
  }

  get items() {
    const { document } = this.props
    const all = [...(this.docs || []), ...(document.updates || [])]
    return sortBy(all, 'createdAt')
  }
}

@view
class Update {
  render({ update }) {
    return (
      <update $$row>
        <tag $$row if={update.type === 'tag'}>
          Nick added the tag <highlight>&nbsp;{update.name}</highlight>
        </tag>
        <assign $$row if={update.type === 'assign'}>
          Nick assigned <highlight>&nbsp;{update.to}</highlight>
        </assign>
        <when>
          {ago(update.createdAt)}
        </when>
      </update>
    )
  }

  static style = {
    update: {
      width: '80%',
      padding: 8,
      fontSize: 14,
      boxShadow: '1px 1px 3px #efefef',
      alignSelf: 'center',
      border: '1px solid #eee',
      borderRadius: 5,
      marginTop: 5,
      marginBottom: 5,
      paddingRight: 20,
      paddingLeft: 20,
      justifyContent: 'space-between',
    },
    highlight: {
      fontWeight: 600,
    },
    when: {
      opacity: 0.7,
    },
  }
}

@view.attach('explorerStore')
@view({
  store: ThreadStore,
})
export default class ThreadView {
  render({ store, document }) {
    const isDoc = item => !!item.content
    const tags = ['Enhancement', 'New Issue', 'Bug']
    const assignTo = ['Nick', 'Nate', 'Sam']

    return (
      <thread>
        <actions css={{ padding: [0, 30, 20] }}>
          <item $$row>
            <UI.Text size={0.95} color={[0, 0, 0, 0.5]}>
              Assign To:&nbsp;&nbsp;
            </UI.Text>
            {assignTo.map(name =>
              <UI.Button onClick={() => store.assignTo(name)}>
                {capitalize(name)}
              </UI.Button>
            )}
          </item>
          <space css={{ height: 10 }} />
          <item $$row>
            <UI.Text size={0.95} color={[0, 0, 0, 0.5]}>
              Label:&nbsp;&nbsp;
            </UI.Text>
            {tags.map(name =>
              <UI.Button onClick={() => store.addTag(name)}>
                {capitalize(name)}
              </UI.Button>
            )}
          </item>
        </actions>
        {store.items.map(
          item =>
            isDoc(item) ? <Message doc={doc} /> : <Update update={item} />
        )}

        <reply>
          <UI.Button
            if={!store.showReply}
            onClick={store.ref('showReply').toggle}
          >
            Add reply
          </UI.Button>
          <container $show={store.showReply}>
            <Draft $draft isReply document={document} />
          </container>
        </reply>
      </thread>
    )
  }

  static style = {
    thread: {
      flex: 1,
    },
    reply: {
      borderTop: [1, '#eee'],
      padding: [20, 20],
    },
    draft: {
      margin: [0, -15],
    },
    container: {
      display: 'none',
      overflow: 'hidden',
      transition: 'all ease-in 150ms',
    },
    show: {
      display: 'flex',
    },
  }
}
