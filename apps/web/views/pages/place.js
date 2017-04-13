import { view } from 'helpers'
import { Title, Text, Page, Link } from 'views'
import { Place } from 'models'

class BaseStore {
  constructor(props) {
    this.props = props
  }
}

class Store extends BaseStore {
  place = Place.get(Router.params.name).observable
}

@view.provide({
  place: Store
})
export default class PlacePage {
  render({ place }) {
    if (!place.place.current) {
      return null
    }

    const [active] = place.place.current

    return (
      <Page>
        <Page.Main>
          {active.title}
        </Page.Main>
      </Page>
    )
  }
}

