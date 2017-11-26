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
        <div if={store.crawler}>
          <UI.Separator>Settings</UI.Separator>

          <UI.Row>
            <UI.Label>Version</UI.Label>
            <UI.Text>{store.crawler.version}</UI.Text>
          </UI.Row>

          <UI.Row>
            <UI.Label>Max Depth</UI.Label>
            <UI.Input onChange={store.setDepth} value={settings.depth} />
          </UI.Row>

          <UI.Separator>Preview</UI.Separator>
          <UI.Button
            if={!store.crawler.isRunning}
            $btn
            onClick={store.onPreview}
          >
            run preview
          </UI.Button>
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
    btn: {
      marginLeft: 20,
    },
  }
}
