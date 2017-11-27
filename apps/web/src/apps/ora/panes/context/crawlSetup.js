import { view } from '@mcro/black'
import { debounce } from 'lodash'
import * as UI from '@mcro/ui'

class CrawlSetupStore {
  get crawler() {
    return this.props.crawler
  }

  willMount() {
    this.watch(function crawlerSetupWatchEntry() {
      if (this.props.settings.entry) {
        this.preview()
      }
    })
  }

  willUnmount() {
    this.unmounted = true
  }

  preview = debounce(async () => {
    if (this.unmounted) {
      return
    }
    const { settings } = this.props
    await this.crawler.stop()
    this.crawler.settings = {
      ...settings,
      maxPages: 6,
    }
    this.crawler.start()
  }, 300)

  handleSetting = key => e =>
    this.props.onChangeSettings({ [key]: e.target.value })
}

@view({
  store: CrawlSetupStore,
})
export default class CrawlSetup {
  render({ store, settings }) {
    const lblProps = {
      paddingLeft: 0,
      width: 100,
      alignItems: 'flex-end',
      fontWeight: 600,
    }
    return (
      <setup css={{ flex: 1, overflowY: 'scroll' }} if={store.crawler}>
        <UI.Separator>Settings</UI.Separator>
        <content>
          <UI.Row>
            <UI.Label {...lblProps}>Entry</UI.Label>
            <UI.Text ellipse>{settings.entry}</UI.Text>
          </UI.Row>
          <UI.Row>
            <UI.Label tooltip="Limit to subpath" {...lblProps}>
              Max Depth
            </UI.Label>
            <UI.Input
              flex
              onChange={store.handleSetting('depth')}
              value={settings.depth}
            />
          </UI.Row>
          <UI.Row>
            <UI.Label tooltip="Limit total pages" {...lblProps}>
              Max Pages
            </UI.Label>
            <UI.Input
              flex
              onChange={store.handleSetting('maxPages')}
              value={settings.maxPages}
            />
          </UI.Row>
        </content>

        <UI.Separator
          after={
            <UI.Button
              tooltip="Refresh preview"
              chromeless
              icon="refresh"
              onClick={store.onPreview}
            />
          }
        >
          Preview
        </UI.Separator>
        <content>
          <UI.List
            css={{ maxWidth: '100%' }}
            items={
              store.crawler.results || [{ contents: { title: 'Loading...' } }]
            }
            getItem={({ contents }) => ({
              primary: contents.title,
              children: contents.body,
            })}
          />
        </content>
      </setup>
    )
  }

  static style = {
    content: {
      padding: 10,
    },
  }
}
