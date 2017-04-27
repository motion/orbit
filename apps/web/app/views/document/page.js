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
        header
        sidebar={
          <side $$flex>
            side ;alala
          </side>
        }
        actions={[
          <Button onClick={store.toggleCollab}>collab</Button>,
          <Button onClick={doc.togglePrivate}>
            make {doc.private ? 'public' : 'private'}
          </Button>,
        ]}
      >
        <content $$flex $$row>
          <main $$flex={2}>
            <docarea $$undraggable>
              <Document {...props} />
            </docarea>

            <met if={!noSide}>
              <ago>
                <TimeAgo minPeriod={20} date={doc.updatedAt} />
              </ago>
              <places $$row if={doc.places}>
                places:
                {doc.places.map(name => <place key={name}>{name}</place>)}
              </places>
            </met>
          </main>
        </content>
      </Page>
    )
  }

  static style = {
    ago: {
      flexFlow: 'row',
    },
    main: {
      padding: 15,
      position: 'relative',
    },
    met: {
      flexFlow: 'row',
      justifyContent: 'space-between',
    },
    docarea: {
      flex: 1,
    },
  }
}
