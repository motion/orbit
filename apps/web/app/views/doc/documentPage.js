import { view } from '~/helpers'
import { Page } from '~/views'
import TimeAgo from 'react-timeago'
import Document from './document'
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
      <Page>
        <main $$flex={2}>
          <Document {...props} />
        </main>

        <side if={!noSide}>
          <ago>
            <span>last edited </span>
            <TimeAgo minPeriod={20} date={doc.updated_at} />
          </ago>
          <places if={doc.places}>
            belongs to places:
            {doc.places.map(name => <place key={name}>{name}</place>)}
          </places>
        </side>
      </Page>
    )
  }

  static style = {
    ago: {
      flexFlow: 'row',
    },
  }
}
