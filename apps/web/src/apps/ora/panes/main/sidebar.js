import * as React from 'react'
import * as UI from '@mcro/ui'
import { fuzzy } from '~/helpers'
import { Thing } from '~/app'

export default class MainSidebar {
  get oraStore() {
    return this.props.oraStore
  }
  get search() {
    return this.oraStore.search
  }
  get recentItems() {
    return this.oraStore.items || []
  }
  // public api
  get items() {
    let results = []
    const { lastContext } = this.oraStore
    if (lastContext) {
      results = [
        {
          ...this.oraStore.contextToResult(lastContext),
          category: 'Context',
        },
      ]
    }
    if (this.recentItems.length) {
      results = [
        ...results,
        ...this.recentItems.map(x => ({
          ...Thing.toResult(x),
          type: 'context',
          category: 'Recent',
        })),
      ]
    } else {
      results = [
        ...results,
        {
          type: 'message',
          title: 'Welcome to Orbit',
        },
      ]
    }
    return results
  }

  get title() {
    return {
      title: (
        <UI.Popover
          openOnHover
          closeOnEsc
          theme="light"
          delay={300}
          arrow
          width={140}
          boxShadow={[[0, 0, 10, [0, 0, 0, 0.2]]]}
          target={
            <UI.Button
              sizeRadius={2}
              sizePadding={2}
              iconAfter
              iconProps={{
                size: 12,
              }}
              icon="arrow-min-down"
              margin={[-2, 0]}
              glow
              css={{
                zIndex: 10,
              }}
              alpha={0.8}
            >
              All
            </UI.Button>
          }
        >
          <UI.List
            itemProps={{
              primaryEllipse: true,
              sizeHeight: 1.15,
              hoverBackground: [0, 0, 0, 0.025],
            }}
            items={[
              { primary: 'dropbox.com' },
              { primary: 'support.stripe.com' },
              { primary: 'Slack', icon: 'social-slack' },
            ]}
          />
        </UI.Popover>
      ),
      after: (
        <UI.Icon
          css={{
            zIndex: 10,
          }}
          color={[255, 255, 255, 0.2]}
          hoverColor={[255, 255, 255, 0.45]}
          name="gear"
          onClick={this.props.oraStore.actions.openSettings}
        />
      ),
    }
  }

  get results() {
    const { search } = this
    const items = [...this.items]
    if (!search) {
      return items
    }
    const filteredSearch = fuzzy(this.items, search)
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
