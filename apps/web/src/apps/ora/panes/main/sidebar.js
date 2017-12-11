import { contextToResult } from '~/helpers'
import { Thing } from '~/app'
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
          onClick: () => {
            this.oraStore.pin.add({
              url:
                'https://support.stripe.com/questions/i-have-a-charge-on-my-card-from-stripe-but-i-m-not-a-stripe-user',
            })
            this.oraStore.pin.add({
              url:
                'https://support.stripe.com/questions/i-have-a-charge-on-my-card-from-stripe-but-i-m-not-a-stripe-user',
            })
            Thing.createFromCrawl({
              url:
                'http://marginalrevolution.com/marginalrevolution/2017/12/adam-smith-occupational-licensing.html',
              contents: { title: 'Crawl Test', content: 'Crawl Test Body' },
            })
            Thing.createFromCrawl({
              url:
                'https://support.stripe.com/questions/why-are-my-customers-charges-marked-as-recurring',
              contents: {
                title: 'Why are my customers charges marked as recurring?',
                content: 'Crawl Test Body',
              },
            })
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
