import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import rc from 'randomcolor'
import { Document } from '@mcro/models'
import { random } from 'lodash'
import Router from '~/router'

@view({
  store: class InboxStore {
    docs = Document.child(this.props.doc._id)

    add = async () => {
      const { doc } = this.props

      const next = await Document.create({
        title: 'new item',
        parentId: doc._id,
      })

      Router.go(next.url())
    }
  },
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
        primary: this.title('CouchDB won\'t boot on OTP-20'),
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
        <UI.Badge background={rc()} color="#fff" height={20}>
          hi
        </UI.Badge>
        <UI.Badge background={rc()} color="#fff" height={20}>
          hi
        </UI.Badge>
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
    const docs = store.docs || []
    const useTestData = false
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
          <UI.Title size={4}>Inbox</UI.Title>

          <actions>
            <UI.Button
              background="green"
              borderColor="rgb(27, 145, 83)"
              color="white"
              size={1}
              icon="siadd"
              onClick={store.add}
            >
              New
            </UI.Button>
          </actions>
        </bar>
        <UI.Title size={2.5}>
          {docs.length} items
        </UI.Title>
        <UI.List items={items} />
      </inbox>
    )
  }

  static style = {
    inbox: {
      padding: 20,
    },
    bar: {
      flexFlow: 'row',
      justifyContent: 'space-between',
    },
  }
}
