import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { random } from 'lodash'
import DocumentView from '~/views/document'

const GLOW_PROPS = {
  color: 'salmon',
  scale: 1.6,
  offsetLeft: -200,
  resist: 70,
  opacity: 0.048,
}

class InboxStore {
  showDraft = true
  draftNumber = 0
  draft = null
  highlightIndex = 0
  activeIndex = null

  get items() {
    return [
      {
        title: 'Support stable and update options with mango queries ',
        status: '#621 opened 3 days ago by garrensmith',
        icon: 'alerti',
      },
      {
        title: 'POST and ETag header',
        status: '#620 opened 3 days ago by danielwertheim',
        icon: 'alerti',
      },
      {
        title: 'Deploy to Heroku Button',
        status: '#619 opened 4 days ago by spencerthayer ',
        icon: 'alerti',
      },
      {
        title: "CouchDB won't boot on OTP-20",
        status: '#619 opened 4 days ago by spencerthayer ',
        icon: 'alerti',
      },
      {
        title: 'Create a Helm chart to deploy CouchDB using Kubernetes',
        status: '#619 opened 4 days ago by spencerthayer ',
        icon: 'alerti',
      },
    ]
  }

  get activeItem() {
    return this.activeIndex !== null ? this.items[this.activeIndex] : null
  }

  start() {
    const { explorerStore } = this.props

    this.on(explorerStore, 'action', (name: string) => {
      if (name === 'up' && this.highlightIndex > 0) {
        this.highlightIndex--
      }

      if (name === 'down') {
        this.highlightIndex++
      }

      if (name === 'enter') {
        this.activeIndex = this.highlightIndex
      }

      if (name === 'esc') {
        this.activeIndex = null
      }
    })
  }
}
@view
class Message {
  render({ name, message }) {
    return (
      <draft>
        <top $$row>
          <UI.Title size={0.9}>
            <b>
              {name}
            </b>
          </UI.Title>
          <time>
            June {random(1, 25)}
          </time>
        </top>
        <p $textarea>
          {message}
        </p>
      </draft>
    )
  }

  static style = {
    draft: {
      padding: [10, 18],
      border: '1px solid #efefef',
      borderRadius: 5,
      marginTop: 10,
      boxShadow: '0px 1px 0px #eee',
    },
    top: {
      justifyContent: 'space-between',
    },
    reactions: {
      justifyContent: 'space-between',
      width: 100,
      opacity: 0.5,
      fontSize: 16,
    },
    time: {
      color: '#666',
      fontSize: 13,
    },
    status: {
      justifyContent: 'center',
      opacity: 0.7,
    },
    b: {
      marginLeft: 4,
      marginRight: 4,
    },
    actions: {
      justifyContent: 'space-between',
    },
    buttons: {
      width: 150,
      justifyContent: 'space-between',
    },
    discard: {
      opacity: 0.6,
    },
    p: {
      lineHeight: 1.4,
      padding: 5,
      margin: [5, 0],
      color: '#333',
      border: '0px solid black',
      width: '100%',
      fontSize: 13,
    },
  }
}

@view({
  store: class ThreadDraftStore {
    text = ''
  },
})
class Draft {
  render({ store }) {
    return (
      <draft>
        <top $$row>
          <UI.Title size={1}>
            <b>Nick</b>
          </UI.Title>
          <time>June 12</time>
        </top>
        <textarea
          onChange={e => (store.text = e.target.value)}
          value={store.value}
          placeholder="Your response"
        />
        <actions $$row if={store.text.length > 0}>
          <status>
            <remind $$row>
              Remind me &nbsp;<b>in 2 days</b>&nbsp; if &nbsp;<b>no reply</b>&nbsp;
            </remind>
          </status>
          <buttons $$row>
            <UI.Button $discard chromeless>
              Discard
            </UI.Button>
            <UI.Button
              width={70}
              icon="send"
              chromeless
              onClick={() => (store.activeIndex = null)}
            >
              Send
            </UI.Button>
          </buttons>
        </actions>
      </draft>
    )
  }

  static style = {
    draft: {
      padding: [10, 18],
      border: '1px solid #ddd',
      borderRadius: 5,
      marginTop: 10,
      boxShadow: '0px 1px 0px #aaa',
    },
    name: {
      fontWeight: 'bold',
    },
    top: {
      justifyContent: 'space-between',
    },
    time: {
      opacity: 0.7,
      fontSize: 13,
    },
    status: {
      justifyContent: 'center',
      opacity: 0.7,
    },
    actions: {
      marginTop: 15,
      justifyContent: 'space-between',
    },
    buttons: {
      width: 150,
      justifyContent: 'space-between',
    },
    discard: {
      opacity: 0.6,
    },
    textarea: {
      margin: [10, 5],
      color: '#333',
      border: '0px solid black',
      width: '100%',
      fontSize: 14,
    },
  }
}

@view
class Thread {
  render({ store }) {
    const { activeItem: item } = store
    const messages = [
      {
        name: 'Steel Brain',
        message: (
          <span>
            Hey! <br />
            <br />We really appreciate you taking the time to report an issue.
            The collaborators on this project attempt to help as many people as
            possible, but we're a limited number of volunteers, so it's possible
            this won't be addressed swiftly.<br />
            <br />If you need any help, or just have general Babel or JavaScript
            questions, we have a vibrant Slack community that typically always
            has someone willing to help. You can sign-up here for an invite.
          </span>
        ),
      },
      {
        name: 'Nate Wienert',
        message: (
          <span>
            I would like to be able to add comments both as BlockComments as
            well as LineComments to an AST with babel-types. <br />
            <br />For this I would propose the syntax shown above. Ideally I
            would like to be able to add a comment before a functionDeclaration,
            methodDeclaration, ... too, but this will change a lot of APIs.{' '}
            <br />
            <br />This lead my to the conclusion that these kind of comments
            might be a quick win.
          </span>
        ),
      },
      {
        name: 'Nick Cammarata',
        message: (
          <span>
            My use case is that I would like to generate a file in JS from
            another language not as part of a build chain but for once per
            library change usage. <br />
            <br />This means in conclusion that users of the generated classes
            ideally will never have to know where the original source is and
            including the comments is super important for that.
          </span>
        ),
      },
    ]

    return (
      <thread>
        <bar>
          <barblur>
            <UI.Glow $glow {...GLOW_PROPS} show />
            <UI.Button
              chromeless
              glow={false}
              spaced
              size={1.2}
              icon={'arrow-min-left'}
              onClick={() => (store.activeIndex = null)}
              color={[0, 0, 0, 0.2]}
              hoverColor={[0, 0, 0, 0.6]}
              margin={[0, 0, 0, -5]}
            />

            <title>
              {item.title}
            </title>
            <UI.Button
              glow={false}
              chromeless
              size={1.2}
              icon="fav31"
              color={[0, 0, 0, 0.4]}
              hoverColor={[0, 0, 0, 0.6]}
            />
            <actions />
          </barblur>
        </bar>
        <content>
          {messages.map(message => <Message {...message} />)}
          <Draft />
        </content>
      </thread>
    )
  }

  static style = {
    // so it scrolls nicely
    thread: {
      paddingBottom: 30,
    },
    glow: {
      pointerEvents: 'none',
    },
    bar: {
      position: 'sticky',
      zIndex: 1000,
      top: 0,
      left: -20,
      borderBottom: '1px solid #ddd',
      boxShadow: ['0 0 5px rgba(0,0,0,0.15)'],
      overflow: 'hidden',
    },
    barblur: {
      margin: -20,
      padding: 30,
      backdropFilter: 'blur(10px)',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexFlow: 'row',
      // boxShadow: ['inset 0 0 100px rgba(240,240,255, 1)'],
      background: 'rgba(255, 255,255, 0.9)',
    },
    title: {
      flex: 5,
      color: '#444',
      fontWeight: 300,
      fontSize: 16,
      lineHeight: '1.4rem',
    },
    content: {
      padding: 20,
    },
  }
}

@view.attach('explorerStore')
@view({
  // draft = watch(() =>
  //   Document.create({
  //     title: '',
  //     _tempId: this.draftNumber,
  //     parentId: this.props.doc._id,
  //   })
  // )
  store: InboxStore,
})
export default class Inbox {
  render({ store }) {
    // subscribe to variable
    store.highlightIndex

    return (
      <inbox>
        <content if={!store.activeItem}>
          <bar>
            <UI.Title size={1} stat={`${store.items.length} new`}>
              Threads
            </UI.Title>
            <actions>
              <UI.Button
                css={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                }}
                icon="siadd"
                circular
                size={1.4}
                chromeless
                onClick={store.ref('draftNumber').increment(1)}
              />
            </actions>
          </bar>

          <UI.List
            background="transparent"
            $list
            itemProps={{ paddingLeft: 20, height: 'auto', padding: 15 }}
            items={store.items}
            getItem={(item, index) => ({
              primary: item.title,
              secondary: item.status,
              date: '1 day ago',
              ellipse: false,
              glowProps: GLOW_PROPS,
              //icon: item.icon,
              paddingRight: 80,
              onClick: () => (store.activeIndex = index),
              onMouseEnter: () => (store.highlightIndex = index),
              $highlight: store.highlightIndex === index,
            })}
          />
        </content>

        <Thread if={store.activeItem} store={store} />

        <UI.Drawer
          if={false}
          from="bottom"
          percent={80}
          open={true && store.draft && store.draft._id && store.showDraft}
        >
          <DocumentView if={false} document={store.draft} />
        </UI.Drawer>
      </inbox>
    )
  }

  static style = {
    list: {
      marginLeft: -20,
      marginRight: -20,
    },
    title: {
      fontWeight: 'bold',
    },
    item: {
      padding: 10,
      paddingLeft: 20,
      height: 40,
    },
    highlight: {
      background: '#eee',
      borderLeft: '3px solid #999',
    },
    all: {
      marginTop: 15,
    },
    inbox: {
      padding: 0,
    },
    content: {
      padding: 20,
    },
    list: {
      marginLeft: -20,
      marginRight: -(20 + 72),
    },
    title: {
      fontWeight: 'bold',
      lineHeight: 100,
    },
    item: {
      padding: 10,
      paddingLeft: 20,
      height: 40,
    },
    highlight: {
      background: '#eee',
      borderLeft: '3px solid #999',
    },
    all: {
      marginTop: 15,
    },
    bar: {
      flexFlow: 'row',
      marginBottom: 5,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  }
}
