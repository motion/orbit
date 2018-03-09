import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Setting } from '@mcro/models'

@view({
  settingsStore: class SettingsStore {
    dataSources = Setting.get({ type: 'data-sources' })

    get sources() {
      return Object.keys(this.dataSources || {}).filter(
        k => !!this.dataSources.values[k],
      )
    }
  },
})
export default class OrbitSettings {
  render({ settingsStore: { sources } }) {
    if (!sources.length) {
      console.log('no sources!!!!!!!!')
      // loading
      return null
    }
    return (
      <settings css={{ padding: [0, 10] }}>
        <UI.Title fontWeight={600}>Sources</UI.Title>
        <content css={{ padding: [10, 5] }}>
          {sources.map(source => (
            <item
              key={source.title}
              css={{
                flexFlow: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <UI.Title size={1.5}>{source.title}</UI.Title>
              <UI.Toggle />
            </item>
          ))}
        </content>
      </settings>
    )
  }
}
