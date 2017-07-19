import { view } from '@mcro/black'
import { Thread, Document } from '@mcro/models'
import * as UI from '@mcro/ui'
import Message from './message'
import { sortBy, capitalize } from 'lodash'
import timeAgo from 'time-ago'
import Draft from './draft'

const { ago } = timeAgo()

class ThreadStore {
  docs = Document.replies(this.props.document)
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
    return sortBy(all, i => +new Date(i.createdAt))
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
      maxWidth: 400,
      padding: 8,
      fontSize: 14,
      alignSelf: 'center',
      borderRadius: 5,
      marginTop: 5,
      marginBottom: 5,
      paddingRight: 20,
      paddingLeft: 20,
      opacity: 0.7,
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
          <action $$row>
            <UI.Text size={0.95} color={[0, 0, 0, 0.5]}>
              Assign To:&nbsp;&nbsp;
            </UI.Text>
            {assignTo.map(name =>
              <UI.Button
                chromeless
                $button
                onClick={() => store.assignTo(name)}
              >
                {capitalize(name)}
              </UI.Button>
            )}
          </action>
          <space css={{ height: 10 }} />
          <action $$row>
            <UI.Text size={0.95} color={[0, 0, 0, 0.5]}>
              Label:&nbsp;&nbsp;
            </UI.Text>
            {tags.map(name =>
              <UI.Button chromeless $button onClick={() => store.addTag(name)}>
                {capitalize(name)}
              </UI.Button>
            )}
          </action>
        </actions>
        {store.items.map(
          item =>
            isDoc(item) ? <Message doc={item} /> : <Update update={item} />
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
    button: {
      marginLeft: 10,
    },
    reply: {
      borderTop: [1, '#eee'],
      padding: [20, 20],
    },
    draft: {
      margin: [0, -15],
    },
    action: {
      alignItems: 'center',
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
