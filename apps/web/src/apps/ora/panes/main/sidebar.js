import { contextToResult } from '~/helpers'
import { Thing } from '~/app'
import ContentStore from '~/stores/contentStore'
import * as Constants from '~/constants'

export default class MainSidebar {
  get oraStore() {
    return this.props.oraStore
  }
  get search() {
    return this.oraStore.ui.search
  }

  get title() {
    return null
  }

  get rawResults() {
    let results = []

    // context item
    const { lastContext } = this.oraStore
    if (lastContext) {
      results = [
        {
          ...contextToResult(lastContext),
          category: 'Context',
        },
      ]
    }

    // results
    if (this.oraStore.contextResults.length) {
      results = [
        ...results,
        ...this.oraStore.contextResults.map(item => ({
          ...item,
          category: 'All',
        })),
      ]
    } else {
      results = [
        ...results,
        {
          title: 'Welcome to Orbit',
          category: 'Setup',
          onClick: this.oraStore.actions.openSettings,
          children:
            'You can add content two ways. Navigate to a website, or click here to setup integrations.',
        },
      ]
    }

    // dev helpers
    if (Constants.IS_DEV) {
      results = [
        ...results,
        {
          title: 'Clear all things...',
          onClick: () => Thing.destroyAll().then(x => x.confirm()),
          category: 'Dev Tools',
        },
        {
          title: 'Insert test things...',
          onClick: async () => {
            const content = new ContentStore()
            await Promise.all(
              content.things.map(async t => await Thing.create(t))
            )
          },
          category: 'Dev Tools',
        },
      ]
    }
    return results
  }

  get results() {
    const items = this.rawResults
    return items && items.length
      ? items
      : [
          {
            type: 'message',
            title: 'No Results...',
            category: 'Search Results',
          },
        ]
  }
}
