import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import rc from 'randomcolor'
import { Document } from '@mcro/models'
import { random } from 'lodash'

@view({
  store: class InboxStore {
    docs = Document.child(this.props.doc._id)
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

  render({ store, doc }) {
    const useTestData = false
    const items = useTestData
      ? this.testData()
      : (store.docs || []).map(item => ({
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
        <UI.Title size={4}>Inbox</UI.Title>

        <UI.List items={items} />
      </inbox>
    )
  }

  static style = {
    inbox: {
      padding: 20,
    },
  }
}
