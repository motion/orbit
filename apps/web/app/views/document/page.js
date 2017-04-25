import { view } from '~/helpers'
import { Page, Button } from '~/views'
import Router from '~/router'
import TimeAgo from 'react-timeago'
import Document from './index'
import DocumentStore from './store'

@view({ store: DocumentStore })
export default class DocumentPage {
  componentWillMount() {
    this.props.store.start(this.props.id || this.props.doc._id)
  }

  render({ store, noSide, ...props }) {
    const { doc } = store

    if (!doc) {
      return null
    }

    return (
      <Page
        header={
          <Page.Head>
            <Button onClick={() => Router.back()}>collab</Button>
          </Page.Head>
        }
      >
        <content $$flex $$row>
          <main $$flex={2}>
            <docarea>
              <Document {...props} />
            </docarea>

            <met if={!noSide}>
              <ago>
                <TimeAgo minPeriod={20} date={doc.updated_at} />
              </ago>
              <places $$row if={doc.places}>
                places:
                {doc.places.map(name => <place key={name}>{name}</place>)}
              </places>
            </met>
          </main>

          <bar if={false}>
            <item>a</item>
            <item>b</item>
            <item>c</item>
            <item>d</item>
            <item>e</item>
            <item>f</item>
          </bar>
        </content>
      </Page>
    )
  }

  static style = {
    ago: {
      flexFlow: 'row',
    },
    main: {
      padding: 10,
      position: 'relative',
    },
    met: {
      flexFlow: 'row',
      justifyContent: 'space-between',
    },
    docarea: {
      flex: 1,
    },
    bar: {
      padding: 5,
      borderLeft: [1, '#eee'],
      alignItems: 'center',
    },
    item: {
      padding: [13, 8],
      fontSize: 20,
      alignItems: 'center',
    },
  }
}
