import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Reply from './reply'
import Draft from './draft'
import { sortBy, capitalize } from 'lodash'
import timeAgo from 'time-ago'

const { ago } = timeAgo()

class ThreadStore {
  thread = this.props.thread
  replies = this.props.thread.replies()

  assignTo = name => {
    const { thread } = this.props
    thread.addUpdate({ type: 'assign', to: name })
    thread.save()
  }

  addTag = name => {
    const { thread } = this.props
    thread.addUpdate({ type: 'tag', name })
    thread.save()
  }

  hasTag = name => {
    return false
  }

  get items() {
    const { thread } = this.props
    const all = [...(this.replies || []), ...(thread.updates || [])]
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
      borderTop: [1, 'dotted', '#eee'],
      justifyContent: 'space-between',
      padding: [10, 25],
      fontSize: 14,
      borderRadius: 5,
      opacity: 0.7,
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
  render({ store, thread }) {
    const isDoc = item => !!item.content
    const tags = ['Enhancement', 'New Issue', 'Bug']
    const assignTo = ['Nick', 'Nate', 'Sam']

    return (
      <thread>
        <actions css={{ padding: [0, 30, 20] }}>
          <action $$row>
            <UI.Text size={0.95} color={[0, 0, 0, 0.5]}>
              Assigned:&nbsp;
            </UI.Text>
            {assignTo.map(name =>
              <UI.Button
                active={store.thread.assignedTo === name}
                inline
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
              Labels:&nbsp;
            </UI.Text>
            {tags.map(name =>
              <UI.Button
                active={thread.tags.indexOf(name) > -1}
                inline
                $button
                onClick={() => store.addTag(name)}
              >
                {capitalize(name)}
              </UI.Button>
            )}
          </action>
        </actions>
        {store.items.map(
          item =>
            isDoc(item) ? <Reply doc={item} /> : <Update update={item} />
        )}

        <reply>
          <container>
            <Draft
              $draft
              isReply
              document={thread}
              placeholder="Add your reply..."
            />
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
      overflow: 'hidden',
      transition: 'all ease-in 150ms',
    },
  }
}
