import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { isNumber, includes } from 'lodash'
import PersonPicker from './views/personPicker'
import PaneCard from './views/card'
import { Atom } from '@mcro/models'
import timeAgo from 'time-ago'

const { ago } = timeAgo()

const items = [
  {
    label: 'Assignees',
    value: 'No one assigned',
  },
  {
    label: 'Labels',
    value: 'None yet',
  },
  {
    label: 'Milestone',
    value: 'No milestone',
  },
  /*
  {
    label: 'Type',
    value: 'Epic',
    icon: 'tag',
    background: '#5F95F7',
  },
  {
    label: 'Priority',
    value: 'High',
    icon: 'alert',
    background: '#FF9140',
  },
  {
    label: 'Status',
    value: 'TODO',
    icon: 'status',
  },
  {
    label: 'Assignee',
    value: 'Unassigned',
    icon: 'person',
  },
  {
    label: 'Project',
    value: 'Prod Release 2',
    icon: 'space',
  },
  */
]

const SelectableSection = ({ index, activeIndex, ...props }) =>
  <section
    {...props}
    css={{ background: activeIndex === index ? [0, 0, 0, 0.1] : null }}
  />

@view
class Reply {
  render({ author, when, activeIndex, text, index }) {
    const name = includes(author, ' ')
      ? author.split(' ')[0].toLowerCase()
      : author
    const image = name === 'nate' ? 'me' : name

    return (
      <SelectableSection index={index} activeIndex={activeIndex}>
        <reply $$row>
          <img $avatar src={`/images/${image}.jpg`} />
          <bubble>
            <info $$row>
              <name>
                {author}
              </name>
              <when>
                {when}
              </when>
            </info>
            <UI.Text $content>
              {text}
            </UI.Text>
          </bubble>
        </reply>
      </SelectableSection>
    )
  }

  static style = {
    reply: {
      padding: [7, 5],
      width: '100%',
      borderTop: '1px solid #eee',
    },
    avatar: {
      width: 30,
      height: 30,
      borderRadius: 100,
      marginRight: 10,
      marginTop: 10,
    },
    info: {
      marginTop: 5,
      justifyContent: 'space-between',
    },
    bubble: {
      flex: 1,
    },
    content: {
      marginTop: 3,
    },
    when: {
      opacity: 0.7,
    },
  }
}

@view({
  store: class {
    who = null
  },
})
class MetaItem {
  render({ store, label, value }) {
    return (
      <item>
        <PersonPicker
          if={false}
          popoverProps={{
            target: <UI.Button>assign</UI.Button>,
          }}
          onSelect={person => {
            store.who = person
          }}
        />
        <name>
          {label}
        </name>
        <value>
          {store.who ? store.who : value}
        </value>
      </item>
    )
  }

  static style = {
    name: {
      fontWeight: 500,
    },
  }
}

@view({
  store: class TaskStore {
    response = ''

    submit = () => {
      Atom.addComment(this.response)
      this.response = ''
    }
  },
})
export default class BarTaskPane {
  getLength = () => 5
  render({ highlightIndex, data, activeIndex, store, paneProps }) {
    const commentButtonActive = store.response.trim().length > 0
    const title = data.title || 'Create a Helm chart to deploy CouchDB on K8s'
    const comments = data.comments || [0, 1].map(() => 'just a test')
    const type = data.type || 'github'

    return (
      <PaneCard $paneCard id={data.id} title={title} icon={type}>
        {/* everything but comment area so comment area is sticky footer */}
        <content>
          <metaInfo $$row>
            {items.map(item => <MetaItem {...item} />)}
          </metaInfo>

          {comments.map((comment, index) =>
            <Reply
              index={index + 1}
              activeIndex={activeIndex}
              when={ago(comment.date)}
              author={comment.author}
              text={
                <div>
                  {comment.text}
                </div>
              }
            />
          )}
        </content>
        <comment>
          <textarea
            $response
            value={store.response}
            onChange={e => (store.response = e.target.value)}
            placeholder="Leave a comment"
          />
          <info $$row>
            <shortcut $bright={commentButtonActive}>cmd+enter to post</shortcut>
            <buttons $$row>
              <UI.Button disabled={!commentButtonActive}>Archive</UI.Button>
              <UI.Button
                disabled={!commentButtonActive}
                onClick={store.submit}
                icon="send"
              >
                Comment
              </UI.Button>
            </buttons>
          </info>
        </comment>
      </PaneCard>
    )
  }

  static style = {
    metaInfo: {
      justifyContent: 'space-between',
      margin: [5, 40],
    },
    paneCard: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
    break: {
      height: 8,
      width: '100%',
    },
    label: {
      width: '35%',
      textAlign: 'right',
    },
    subtitle: {
      margin: [5, 0, 0],
      opacity: 0.6,
    },
    primary: {
      flexFlow: 'row',
      alignItems: 'center',
    },
    info: {
      marginTop: 5,
      justifyContent: 'space-between',
    },
    buttons: {
      flex: 1,
      justifyContent: 'space-between',
    },
    shortcut: {
      flex: 2,
      alignSelf: 'center',
      marginLeft: 5,
      opacity: 0.4,
    },
    bright: {
      opacity: 0.7,
    },
    response: {
      marginTop: 5,
      background: '#fafbfc',
      border: '1px solid rgb(209, 213, 218)',
      width: '100%',
      height: 80,
      borderRadius: 5,
      padding: 10,
      fontSize: 14,
    },
  }
}
