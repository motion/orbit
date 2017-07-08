import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import rc from 'randomcolor'
import { Document } from '@mcro/models'
import { random } from 'lodash'
import Router from '~/router'
import DocumentView from '~/views/document'

class InboxStore {
  showDraft = true
  draftNumber = 0
  draft = null
  highlightIndex = 0
  activeIndex = 2

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
    console.log('exp', explorerStore)

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
          <UI.Title size={2}>
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
          <UI.Title size={2}>
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
      <item>
        <bar $$row>
          <UI.Button
            chromeless
            spaced
            size={1.2}
            icon={'arrow-min-left'}
            onClick={() => (store.activeIndex = null)}
            color={[0, 0, 0, 0.6]}
          />

          <UI.Title centered $title size={3} stat={``}>
            {item.title}
          </UI.Title>
          <UI.Button chromeless size={1.2} icon="fav31" />
          <actions />
        </bar>
        <thread>
          {messages.map(message => <Message {...message} />)}
          <Draft />
        </thread>
      </item>
    )
  }

  static style = {
    // so it scrolls nicely
    item: {
      paddingBottom: 30,
    },
    bar: {
      position: 'sticky',
      marginTop: 15,
      zIndex: 1000,
      paddingTop: 0,
      justifyContent: 'space-between',
      top: 0,
      borderBottom: '1px solid #ddd',
      background: `rgba(255,255,255,.9)`,
      paddingBottom: 5,
    },
    title: {
      flex: 5,
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
  title = text => {
    return (
      <title $$row>
        {text}
        &nbsp;&nbsp;
        {false &&
          <UI.Badge background={rc()} color="#fff" height={20}>
            hi
          </UI.Badge>}
        {false &&
          <UI.Badge if={false} background={rc()} color="#fff" height={20}>
            hi
          </UI.Badge>}
      </title>
    )
  }

  status = text => {
    return (
      <status $$row>
        {text} <UI.Progress.Bar percent={Math.random() * 100} />
      </status>
    )
  }

  render({ store }) {
    // subscribe to variable
    store.highlightIndex

    const docs = store.docs || []
    const useTestData = true
    const items = store.items.map((item, index) => ({
      primary: this.title(item.title),
      secondary: this.status(item.status),
      icon: item.icon,
      onClick() {
        console.log('setting index to', index)
        store.activeIndex = index
      },
    }))

    return (
      <inbox>
        <all if={store.activeItem === null}>
          <bar>
            <UI.Title size={3} stat={`${store.items.length} items`}>
              Inbox
            </UI.Title>
            <actions>
              <UI.Button
                icon="siadd"
                onClick={store.ref('draftNumber').increment(1)}
              >
                New
              </UI.Button>
            </actions>
          </bar>

          <UI.List
            $list
            itemProps={{ paddingLeft: 20, height: 'auto', padding: 15 }}
            items={items}
            getItem={(val, index) =>
              <item
                onClick={() => (store.activeIndex = index)}
                onMouseEnter={() => (store.highlightIndex = index)}
                $highlight={store.highlightIndex === index}
              >
                {val.primary}
              </item>}
          />
        </all>
        <Thread if={store.activeItem !== null} store={store} />

        <UI.Drawer
          if={false}
          from="bottom"
          percent={80}
          open={true && store.draft && store.draft._id && store.showDraft}
        >
          <test>test</test>
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
      padding: [0, 20],
    },
    bar: {
      flexFlow: 'row',
      marginBottom: 5,
      justifyContent: 'space-between',
    },
  }
}
