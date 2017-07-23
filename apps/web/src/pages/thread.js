import { Thread } from '~/app'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import Reply from '~/views/document/reply'
import Draft from '~/views/inbox/draft'
import { sortBy, includes, capitalize } from 'lodash'
import timeAgo from 'time-ago'
import DocumentView from '~/views/document'
import Page from './page'

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
    return includes(this.thread.tags(), name)
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

@view({
  store: ThreadStore,
})
export default class ThreadPage {
  render({ store }) {
    const tags = ['Enhancement', 'New Issue', 'Bug']
    const assignTo = ['Nick', 'Nate', 'Sam']

    if (!store.thread) {
      return null
    }

    return (
      <Page showActions>
        <content>
          <DocumentView document={store.thread} isPrimaryDocument />

          <actions if={store.thread}>
            <action $$row>
              <UI.Text size={0.95} color={[0, 0, 0, 0.5]}>
                On it&nbsp;
              </UI.Text>
              {assignTo.map(name =>
                <UI.Button
                  key={name}
                  highlight={store.thread.assignedTo() === name}
                  inline
                  $button
                  onClick={() => store.assignTo(name)}
                >
                  {capitalize(name)}
                </UI.Button>
              )}
            </action>
            <action $$row>
              <UI.Text size={0.95} color={[0, 0, 0, 0.5]}>
                Label&nbsp;
              </UI.Text>
              {tags.map(name =>
                <UI.Button
                  key={name}
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
        </content>

        <replies>
          {store.items.map(item =>
            <item>
              <separator />
              {item.type === 'reply'
                ? <Reply key={item.id} doc={item} />
                : <Update key={item.id} update={item} />}
            </item>
          )}

          <draft $item if={store.thread}>
            <separator />
            <Draft
              $draft
              isReply
              parentId={store.thread.parentId}
              placeholder="Add your reply..."
            />
          </draft>
        </replies>
      </Page>
    )
  }

  static style = {
    thread: {
      flex: 1,
    },
    content: {
      padding: [0, 0, 20],
    },
    button: {
      marginLeft: 10,
    },
    draft: {
      padding: [15, 0, 15, 15],
    },
    action: {
      alignItems: 'center',
      padding: [0, 30, 15],
    },
    item: {
      position: 'relative',
    },
    separator: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 1,
      background: 'linear-gradient(left, #eee 80%, #fff)',
    },
  }
}
