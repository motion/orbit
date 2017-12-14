import { contextToResult } from '~/helpers'
import { Thing } from '~/app'
import * as ContentStore from '~/stores/contentStore'
import * as Constants from '~/constants'
import * as UI from '@mcro/ui'

export default class MainSidebar {
  get oraStore() {
    return this.props.oraStore
  }
  get search() {
    return this.oraStore.ui.search
  }
  get title() {
    const { lastContext } = this.oraStore
    if (!lastContext) {
      return null
    }
    const result = contextToResult(lastContext)
    return {
      title: <div css={{ width: 100 }} />,
      after: (
        <UI.Button
          sizeRadius={2}
          glint={false}
          background="transparent"
          maxWidth={140}
          icon="arrow-min-right"
          iconAfter
          onClick={() => {
            this.oraStore.stack.navigate(result)
          }}
          glow
          alpha={0.5}
          hover={{
            alpha: 1,
            background: 'transparent',
          }}
          css={{
            zIndex: 10,
            margin: [-2, 0],
          }}
        >
          <UI.Text ellipse size={0.8} color="inherit">
            {result.title}
          </UI.Text>
        </UI.Button>
      ),
    }
  }
  get finishedLoading() {
    return true
  }

  get rawResults() {
    let results = []
    // results
    if (this.oraStore.contextResults.length) {
      results = [
        ...results,
        ...this.oraStore.contextResults.map(item => ({
          ...item,
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
            console.log('insering things', ContentStore)
            const res = await Promise.all(
              ContentStore.things.map(t => Thing.create(t))
            )
            console.log('created things', res)
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
