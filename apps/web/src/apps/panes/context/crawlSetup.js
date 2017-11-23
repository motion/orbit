import { view } from '@mcro/black'
import { debounce } from 'lodash'
import * as UI from '@mcro/ui'
import Crawler from '~/stores/crawler'

class CrawlSetupStore {
  preview = null
  crawler = null
  crawler = new Crawler()

  willMount() {
    this.onPreview()
  }

  onPreview = debounce(() => {
    const { osContext: { url }, settings: { depth } } = this.props

    if (this.crawler.isRunning) {
      this.crawler.onStop()
    }

    this.crawler.settings = {
      maxPages: 6,
      entry: url,
      depth,
    }

    this.crawler.onStart()
  }, 300)

  setDepth = ({ target: { value } }) => {
    const { settings, onChangeSettings } = this.props
    onChangeSettings({ ...settings, depth: value })
    this.onPreview()
  }
}

@view({
  store: CrawlSetupStore,
})
export default class CrawlSetup {
  render({ store, settings }) {
    return (
      <setup>
        <top $$row>
          <UI.Title size={1} opacity={0.8}>
            Preview
          </UI.Title>
          <UI.Button $btn onClick={store.onPreview}>
            run preview
          </UI.Button>
        </top>
        <div if={store.crawler}>
          <UI.Title>version {store.crawler.version}</UI.Title>
          <input type="text" onChange={store.setDepth} value={settings.depth} />
          <UI.Title if={store.crawler.isRunning}>running</UI.Title>
          <UI.Title if={store.crawler.results}>
            previewing {store.crawler.results.length} results
          </UI.Title>
          <div>
            {store.crawler.results &&
              store.crawler.results.map(_ => _.contents.title).join(', ')}
          </div>
          <UI.List
            if={store.crawler.results}
            items={store.crawler.results.map(_ => ({
              primary: _.contents.title,
            }))}
          />
        </div>
      </setup>
    )
  }

  static style = {
    top: {},
    btn: {
      marginLeft: 20,
    },
  }
}
