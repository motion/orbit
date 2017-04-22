import { view } from '~/helpers'
import { Page } from '~/views'
import TimeAgo from 'react-timeago'
import Document from '~/views/doc/document'

@view
export default class DocumentPage {
  render({ noSide, ...props }) {
    return (
      <Page>
        <Page.Main>
          <Document {...props} />
        </Page.Main>

        <Page.Side if={!noSide}>
          <ago>
            <span>last edited </span>
            <TimeAgo minPeriod={20} date={doc.updated_at} />
          </ago>
          <places if={doc.places}>
            belongs to places:
            {doc.places.map(name => <place key={name}>{name}</place>)}
          </places>
        </Page.Side>
      </Page>
    )
  }

  static style = {
    ago: {
      flexFlow: 'row',
    },
  }
}
