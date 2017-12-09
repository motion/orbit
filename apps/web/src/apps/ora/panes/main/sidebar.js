import { fuzzy, contextToResult } from '~/helpers'
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
    // dropdown for selecting filter
    //   <UI.Popover
    //   openOnHover
    //   closeOnEsc
    //   theme="light"
    //   delay={300}
    //   width={140}
    //   boxShadow={[[0, 0, 10, [0, 0, 0, 0.2]]]}
    //   target={
    //     <UI.Button
    //       sizeRadius={2}
    //       sizePadding={2}
    //       iconAfter
    //       iconProps={{
    //         size: 12,
    //       }}
    //       icon="arrow-min-down"
    //       margin={[-2, 0]}
    //       glow
    //       css={{
    //         zIndex: 10,
    //       }}
    //       alpha={0.8}
    //     >
    //       All
    //     </UI.Button>
    //   }
    // >
    //   <UI.List
    //     itemProps={{
    //       primaryEllipse: true,
    //       sizeHeight: 1.15,
    //       hover: {
    //         background: [0, 0, 0, 0.025],
    //       },
    //     }}
    //     items={[
    //       { primary: 'dropbox.com' },
    //       { primary: 'support.stripe.com' },
    //       { primary: 'Slack', icon: 'social-slack' },
    //     ]}
    //   />
    // </UI.Popover>
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
      results = [...results, ...this.oraStore.contextResults]
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
    const { search } = this
    const items = this.rawResults
    if (!search) {
      return items
    }
    const filteredSearch = fuzzy(items, search)
    const searchItems = filteredSearch.length
      ? filteredSearch
      : [
          {
            type: 'message',
            title: 'No Results...',
            category: 'Search Results',
          },
        ]
    return searchItems
  }
}
