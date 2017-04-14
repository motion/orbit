import { view } from 'helpers'
import { Title, Text, Page, Link } from 'views'
import { Place } from 'models'
import { Store } from 'stores'

class PlaceStore extends Store {
  place = Place.get(Router.params.name)
}

@view.provide({
  store: PlaceStore,
})
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

