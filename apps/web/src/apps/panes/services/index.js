import { view } from '@mcro/black'
import * as Pane from '~/apps/pane'
import * as UI from '@mcro/ui'
import ServicesStore from './store'
import Progress from './progress'
import Item from './item'

@view({
  store: ServicesStore,
})
export default class Services {
  render({ store }) {
    const { types } = store

    const serviceItems = [...types, 'slack', 'drive'].map(type => () => (
      <Item serviceStore={store} type={type} />
    ))

    return (
      <card>
        <UI.Theme name="light">
          <Pane.Card
            items={[
              () => (
                <meta css={{ flex: 1 }}>
                  <UI.Theme name="light">
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
                        <UI.Button
                          css={{ marginTop: 5, marginLeft: 10 }}
                          icon="refresh2"
                        >
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
                      You have connected <b>3 services</b> and Orbit has
                      downloaded <b>{(store.things || []).length} items</b>
                    </UI.Title>
                    <gradual if={false} css={{ marginTop: 15 }}>
                      <UI.Title size={1.2}>Gradual Syncing</UI.Title>
                      <UI.Text css={{ marginTop: 5 }} opacity={0.8}>
                        Orbit downloads data gradually to avoid too many network
                        requests or overpowering services.
                      </UI.Text>
                    </gradual>
                  </UI.Theme>
                </meta>
              ),
              ...serviceItems,
            ]}
          />
        </UI.Theme>
        <Progress if={false} />
      </card>
    )
  }

  static style = {
    card: {
      padding: 15,
      flex: 1,
      position: 'relative',
      width: '100%',
      background: '#fff',
      boxShadow: [[0, 0, 10, [0, 0, 0, 0.1]]],
      borderRadius: 3,
    },
    meta: {
      marginBottom: 10,
    },
  }
}
