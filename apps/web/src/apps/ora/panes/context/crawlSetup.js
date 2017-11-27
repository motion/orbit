import { view } from '@mcro/black'
import { debounce } from 'lodash'
import * as UI from '@mcro/ui'
import { isEqual } from 'lodash'

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

  preview = debounce(async force => {
    if (this.unmounted) {
      return
    }
    const { settings } = this.props
    const nextSettings = {
      ...settings,
      maxPages: 6,
    }
    if (force || !isEqual(this.crawler.settings, nextSettings)) {
      await this.crawler.stop()
      this.crawler.start(nextSettings)
    }
  }, 300)

  forcePreview = () => this.preview(true)

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
    const rowProps = {
      css: {
        marginBottom: 5,
      },
    }
    return (
      <setup css={{ flex: 1, overflowY: 'scroll' }} if={store.crawler}>
        <UI.Separator>Settings</UI.Separator>
        <content>
          <UI.Row {...rowProps}>
            <UI.Label {...lblProps}>Entry</UI.Label>
            <UI.Input
              disabled
              color={[255, 255, 255, 0.5]}
              value={settings.entry}
            />
          </UI.Row>
          <UI.Row {...rowProps}>
            <UI.Label
              tooltip="Don't crawl anything above this pathname"
              {...lblProps}
            >
              Limit Path
            </UI.Label>
            <UI.Input
              flex
              onChange={store.handleSetting('depth')}
              value={settings.depth}
            />
          </UI.Row>
          <UI.Row {...rowProps}>
            <UI.Label
              tooltip="Set upper limit of pages to gather"
              {...lblProps}
            >
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
              onClick={store.forcePreview}
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
              primary: contents.title || 'No title found',
              children: contents.body || 'No body found',
            })}
          />
        </content>
      </setup>
    )
  }

  static style = {
    content: {
      padding: [4, 10],
    },
  }
}
