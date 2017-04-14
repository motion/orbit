import { view } from 'helpers'
import { Title, Text, Page, Link } from 'views'
import { Place } from 'models'

class BaseStore {
  constructor(props) {
    this.props = props
  }
}

class Store extends BaseStore {
  place = Place.get(Router.params.name)
}

@view.provide({ store: Store })
export default class PlacePage {
  render({ store }) {
    const [active] = store.place.current || []

    if (!active) {
      return null
    }

    window.x = active

    return (
      <Page>
        <Page.Main>
          {active.title}
        </Page.Main>
      </Page>
    )
  }
}

