import { view } from '@mcro/black'
import Pane from '../pane'
import * as UI from '@mcro/ui'
import ServicesStore from './servicesStore'
import Item from './item'
import ServicesSidebar from './sidebar'

@view({
  store: ServicesStore,
})
class Services {
  render({ store, paneProps }) {
    const { types } = store

    // lets turn google into calendar
    const serviceItems = types
      .map(type => (type === 'google' ? 'calendar' : type))
      .map(type => <Item key={type} serviceStore={store} type={type} />)

    return (
      <Pane {...paneProps} css={{ padding: 20 }}>
        <meta>
          <title
            $$row
            css={{
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <left $$row>
              <UI.Title
                onClick={store.ref('isOpen').toggle}
                size={1.8}
                fontWeight={800}
                color="#000"
                marginBottom={1}
              >
                Services
              </UI.Title>
            </left>
            <right $$row>
              <UI.Text
                fontWeight={300}
                css={{ marginTop: 10, marginLeft: 20 }}
                opacity={0.7}
              >
                last sync 4 minutes ago
              </UI.Text>
              <UI.Button css={{ marginTop: 5, marginLeft: 10 }} icon="refresh2">
                sync all
              </UI.Button>
            </right>
          </title>
          <UI.Title
            css={{ alignSelf: 'center', marginTop: 30 }}
            opacity={0.8}
            fontWeight={200}
            size={1.2}
          >
            You have connected <b>3 services</b> and Orbit has downloaded{' '}
            <b>{(store.things || []).length} items</b>
          </UI.Title>
          <gradual if={false} css={{ marginTop: 15 }}>
            <UI.Title size={1.2}>Gradual Syncing</UI.Title>
            <UI.Text css={{ marginTop: 5 }} opacity={0.8}>
              Orbit downloads data gradually to avoid too many network requests
              or overpowering services.
            </UI.Text>
          </gradual>
        </meta>
        {serviceItems}
      </Pane>
    )
  }

  static style = {
    meta: {
      marginBottom: 10,
    },
  }
}

export default {
  Main: Services,
  Sidebar: ServicesSidebar,
}
