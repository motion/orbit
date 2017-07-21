import { Thread } from '@mcro/models'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import Reply from '~/views/document/reply'
import Draft from '~/views/inbox/draft'
import { sortBy, includes, capitalize } from 'lodash'
import timeAgo from 'time-ago'
import DocumentView from '~/views/document'
import Page from './page'
import Actions from '~/views/document/actions'

const { ago } = timeAgo()

class ThreadStore {
  @watch thread = () => Thread.get(this.props.id)
  replies = this.thread && this.thread.replies && this.thread.replies()

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

  removeTag = name => {
    const { thread } = this.props
    thread.addUpdate({ type: 'tagRemove', name })
    thread.save()
  }

  toggleTag = name => {
    if (this.hasTag(name)) {
      this.removeTag(name)
    } else {
      this.addTag(name)
    }
  }

  hasTag = name => {
    return includes(this.thread.tags, name)
  }

  get items() {
    const { thread } = this
    const all = [...(this.replies || []), ...((thread && thread.updates) || [])]
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
        <tag $$row if={update.type === 'tagRemove'}>
          Nick removed the tag <highlight>&nbsp;{update.name}</highlight>
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
export default class ThreadPage {
  render({ store, explorerStore }) {
    const tags = ['Enhancement', 'New Issue', 'Bug']
    const assignTo = ['Nick', 'Nate', 'Sam']

    return (
      <Page sidebar={<Actions />}>
        <DocumentView document={explorerStore.document} isPrimaryDocument />

        <actions if={store.thread}>
          <action $$row>
            <UI.Text size={0.95} color={[0, 0, 0, 0.5]}>
              On it&nbsp;
            </UI.Text>
            {assignTo.map(name =>
              <UI.Button
                highlight={store.thread.assignedTo === name}
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
              Label&nbsp;
            </UI.Text>
            {tags.map(name =>
              <UI.Button
                highlight={store.hasTag(name)}
                inline
                $button
                onClick={() => store.toggleTag(name)}
              >
                {capitalize(name)}
              </UI.Button>
            )}
          </action>
        </actions>
        {store.items.map(
          item =>
            item.type === 'reply'
              ? <Reply doc={item} />
              : <Update update={item} />
        )}

        <reply if={store.thread}>
          <Draft
            $draft
            isReply
            document={store.thread}
            placeholder="Add your reply..."
          />
        </reply>
      </Page>
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
      padding: [0, 30, 20],
    },
  }
}
