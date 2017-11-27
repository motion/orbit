import { view } from '@mcro/black'
import { debounce } from 'lodash'
import * as UI from '@mcro/ui'
import CrawlerStore from '~/stores/crawlerStore'

class CrawlSetupStore {
  crawler = new CrawlerStore()

  willMount() {
    this.watch(() => {
      if (this.props.settings.entry) {
        console.log('call preview')
        this.preview()
      }
    })
  }

  preview = debounce(() => {
    const { settings } = this.props
    if (this.crawler.isRunning) {
      this.crawler.stop()
    }
    this.crawler.settings = {
      ...settings,
      maxPages: 6,
    }
    this.crawler.start()
  }, 300)

  setDepth = ({ target: { value } }) => {
    const { settings, onChangeSettings } = this.props
    onChangeSettings({ ...settings, depth: value })
  }
}

@view({
  store: CrawlSetupStore,
})
export default class CrawlSetup {
  render({ store, settings }) {
    const lblProps = { style: { paddingLeft: 0 } }
    return (
      <setup css={{ flex: 1, overflowY: 'scroll' }} if={store.crawler}>
        <UI.Separator>Settings</UI.Separator>

        <content>
          <UI.Row>
            <UI.Label {...lblProps}>Entry</UI.Label>
            <UI.Text>{settings.entry}</UI.Text>
          </UI.Row>

          <UI.Row>
            <UI.Label {...lblProps}>Max Depth</UI.Label>
            <UI.Input flex onChange={store.setDepth} value={settings.depth} />
          </UI.Row>
        </content>

        <UI.Separator
          after={
            <UI.Button chromeless icon="refresh" onClick={store.onPreview} />
          }
        >
          Preview
        </UI.Separator>
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
      </setup>
    )
  }

  static style = {
    content: {
      padding: 10,
    },
  }
}
