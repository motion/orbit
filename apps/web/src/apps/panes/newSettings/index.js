import { view } from '@mcro/black'
import * as Pane from '~/apps/pane'
import * as UI from '@mcro/ui'
import SettingsStore from './store'
import Item from './item'

@view({
  store: SettingsStore,
})
export default class Settings {
  render({ store }) {
    const { things, types } = store

    const serviceItems = types.map(type => () => (
      <Item store={store} type={type} />
    ))

    return (
      <Pane.Card
        items={[
          () => (
            <meta css={{ flex: 1 }}>
              <title
                $$row
                css={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <left>
                  <UI.Title fontWeight={200} size={2.3}>
                    All Services
                  </UI.Title>
                  <UI.Title opacity={0.6} fontWeight={200} size={1.4}>
                    {(things || []).length} items synced
                  </UI.Title>
                </left>
                <UI.Button onClick={store.clearAll}>clear everything</UI.Button>
              </title>
            </meta>
          ),
          ...serviceItems,
        ]}
      />
    )
  }

  static style = {}
}
