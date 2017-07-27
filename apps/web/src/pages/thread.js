import { Thread } from '~/app'
import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import Reply from '~/views/document/reply'
import Draft from '~/views/inbox/draft'
import { sortBy, includes, capitalize } from 'lodash'
import timeAgo from 'time-ago'
import DocumentView from '~/views/document'
import Page from './page'
import Actions from './page/actions'
import ReplyTitle from '~/views/document/replyTitle'

const { ago } = timeAgo()

class ThreadStore {
  showReply = true

  @watch thread = () => Thread.get(this.props.id)
  @watch
  replies = [
    () => this.thread && this.thread.id,
    () => this.thread && this.thread.replies(),
  ]

  get items() {
    if (!this.thread) {
      return null
    }
    const all = [...(this.replies || []), ...(this.thread.updates || [])]
    return sortBy(all, i => +new Date(i.createdAt))
  }

  assignTo = name => {
    this.thread.addUpdate({ type: 'assign', to: name })
    this.thread.save()
  }

  addTag = name => {
    this.thread.addUpdate({ type: 'tag', name })
    this.thread.save()
  }

  removeTag = name => {
    this.thread.addUpdate({ type: 'tagRemove', name })
    this.thread.save()
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
}

@view
class Update {
  render({ update }) {
    return (
      <update $$row>
        <tag $$row if={update.type === 'tag'}>
          Nick tagged <highlight>&nbsp;{update.name}</highlight>
        </tag>
        <tag $$row if={update.type === 'tagRemove'}>
          Nick untagged <highlight>&nbsp;{update.name}</highlight>
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
      borderTop: [1, 'dotted', '#f2f2f2'],
      justifyContent: 'space-between',
      padding: [12, 25],
      fontSize: 13,
      borderRadius: 5,
      opacity: 0.5,
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

    const btnProps = {
      size: 0.9,
      marginLeft: 5,
      height: 24,
      padding: [0, 5],
      hoverBackground: 'transparent',
      glowProps: {
        scale: 1,
        color: [0, 0, 0, 0.1],
        blur: 20,
        opacity: 1,
        zIndex: -1,
        backdropFilter: 'contrast(200%)',
      },
    }

    let lastItem

    return (
      <Page>
        <content>
          <thread $$row>
            <doc $$flex>
              <DocumentView document={store.thread} isPrimaryDocument />
              <space css={{ height: 10 }} />
            </doc>
            <Actions css={{ alignSelf: 'flex-start' }} />
          </thread>

          <actions if={store.thread}>
            <action $$row>
              <UI.Text size={0.95} color={[0, 0, 0, 0.5]}>
                On it&nbsp;
              </UI.Text>
              {assignTo.map(name =>
                <UI.Button
                  key={name}
                  highlight={store.thread.assignedTo() === name}
                  {...btnProps}
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
                  {...btnProps}
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
          {store.items.map(item => {
            const isMultiUpdate =
              item.type !== 'reply' && lastItem && lastItem.type !== 'reply'
            lastItem = item

            return (
              <item key={item.id || Math.random()}>
                <separator if={!isMultiUpdate} />
                {item.type === 'reply'
                  ? <Reply key={item.id} doc={item} />
                  : <Update key={item.id} update={item} />}
              </item>
            )
          })}

          <draft if={store.thread} $item>
            <separator />
            <draft if={!store.showReply}>
              <UI.Button
                onClick={store.ref('showReply').toggle}
                theme="green"
                color="white"
                hoverColor="white"
                alignSelf="flex-end"
              >
                Reply
              </UI.Button>
            </draft>

            <showndraft if={store.showReply}>
              <title css={{ marginRight: 15 }}>
                <ReplyTitle
                  marginLeft={15}
                  doc={store.thread}
                  staticDate="now"
                />
              </title>
              <Draft
                $draft
                isReply
                parentId={store.thread.id}
                placeholder="Your reply..."
                focus
              />
            </showndraft>
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
      minHeight: 300,
    },
    draft: {
      padding: [15, 10],
    },
    actions: {
      marginTop: 30,
    },
    action: {
      alignItems: 'center',
      padding: [8, 30, 0, 20],
    },
    showndraft: {
      alignItems: 'stretch',
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
