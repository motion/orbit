import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import rc from 'randomcolor'
import { Document } from '@mcro/models'
import { random } from 'lodash'
import Router from '~/router'
import DocumentView from '~/views/document'

class InboxStore {
  docs = Document.child(this.props.doc._id)
  showDraft = true
  draftNumber = 0
  draft = null
  highlightIndex = 0

  start() {
    const { explorerStore } = this.props
    console.log('exp', explorerStore)

    this.on(explorerStore, 'action', (name: string) => {
      if (name === 'up' && this.highlightIndex > 0) {
        this.highlightIndex--
      }

      if (name === 'down' && this.highlightIndex < this.docs.length - 1) {
        this.highlightIndex++
      }

      if (name === 'enter') {
        console.log('enta')
      }
    })
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
  testData = () => {
    return [
      {
        primary: this.title(
          'Support stable and update options with mango queries '
        ),
        secondary: this.status('#621 opened 3 days ago by garrensmith '),
        icon: 'alerti',
      },
      {
        primary: this.title('POST and ETag header'),
        secondary: this.status('#620 opened 3 days ago by danielwertheim '),
        icon: 'alerti',
      },
      {
        primary: this.title('Deploy to Heroku Button'),
        secondary: this.status('#619 opened 4 days ago by spencerthayer '),
        icon: 'alerti',
      },
      {
        primary: this.title("CouchDB won't boot on OTP-20"),
        secondary: this.status('#619 opened 4 days ago by spencerthayer '),
        icon: 'alerti',
      },
      {
        primary: this.title(
          'Create a Helm chart to deploy CouchDB using Kubernetes'
        ),
        secondary: this.status('#619 opened 4 days ago by spencerthayer '),
        icon: 'alerti',
      },
    ]
  }

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
    const items = useTestData
      ? this.testData()
      : docs.map(item => ({
          primary: this.title(item.getTitle()),
          secondary: this.status(
            `#${random(0, 1000)} opened ${random(2, 8)} days ago by natebirdman`
          ),
          icon: 'alerti',
          onClick() {
            Router.go(item.url())
          },
        }))

    return (
      <inbox>
        <bar>
          <UI.Title size={3} stat={`${docs.length} items`}>
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
            <item $highlight={store.highlightIndex === index}>
              {val.primary}
            </item>}
        />

        <UI.Drawer
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
    inbox: {
      padding: [15, 20],
    },
    bar: {
      flexFlow: 'row',
      marginBottom: 5,
      justifyContent: 'space-between',
    },
  }
}
