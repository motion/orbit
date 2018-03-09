import { view, watch } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Setting } from '@mcro/models'

@view({
  settings: class SettingsStore {
    @watch settingSources = () => Setting.get({ type: 'data-sources' })

    get sources() {
      if (!this.settingSources) return []
      return Object.keys(this.settingSources.values)
        .filter(k => !!this.settingSources.values[k])
        .map(key => ({
          id: key,
          ...this.settingSources.values[key],
        }))
    }

    handleChangeSourceActive = source => active => {
      this.settingSources.mergeUpdate({
        values: {
          [source.id]: {
            active,
          },
        },
      })
    }
  },
})
export default class OrbitSettings {
  render({ settings }) {
    if (!settings.sources.length) {
      console.log('no sources!!!!!!!!')
      // loading
      return null
    }
    return (
      <settings css={{ padding: [0, 10] }}>
        <UI.Title fontWeight={600}>Sources</UI.Title>
        <content css={{ padding: [10, 5] }}>
          {settings.sources.map(source => (
            <item
              key={source.title}
              css={{
                flexFlow: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <UI.Title size={1.5}>{source.title}</UI.Title>
              <UI.Toggle
                value={!!source.active}
                onChange={settings.handleChangeSourceActive(source)}
              />
            </item>
          ))}
        </content>
      </settings>
    )
  }
}
