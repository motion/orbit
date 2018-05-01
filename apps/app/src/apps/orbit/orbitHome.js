import * as React from 'react'
import { view, react } from '@mcro/black'
import { SubTitle } from '~/views'
import * as UI from '@mcro/ui'
import { App } from '@mcro/all'
import OrbitDivider from './orbitDivider'
import Masonry from '~/views/masonry'
import OrbitCard from './orbitCard'

@view.attach('appStore')
@view
class MasonryCard {
  static getColumnSpanFromProps = (props, getState) => {
    return 1
  }
  static getHeightFromProps = (getState, props, columnSpan, columnGutter) => {
    return 200
  }
  render() {
    const { index, appStore, item, style } = this.props
    return (
      <OrbitCard
        index={index}
        item={this.props}
        total={appStore.summaryResults.length}
        result={item}
        hoverToSelect
        expanded
        getRef={appStore.setResultRef(item)}
        style={{
          ...style,
          height: 200,
        }}
      />
    )
  }
}

class OrbitExploreStore {
  willUnmount() {
    this.props.appStore.setGetResults(null)
  }

  @react({ fireImmediately: true })
  setExploreResults = [
    () => !!App.state.query,
    hasQuery => {
      const { appStore } = this.props
      if (hasQuery) {
        appStore.setGetResults(null)
      } else {
        appStore.setGetResults(() => appStore.summaryResults)
      }
    },
  ]
}

@view.provide({
  store: OrbitExploreStore,
})
@UI.injectTheme
@view
export default class OrbitExplore {
  render({ appStore, theme }) {
    const exploreButton = {
      size: 1.2,
      circular: true,
      borderWidth: 0,
      borderColor: theme.base.borderColor,
      background: theme.base.background,
      iconProps: {
        color: theme.base.color.darken(0.2),
        size: 14,
      },
    }
    return (
      <pane css={{ background: theme.base.background }}>
        <title css={{ padding: [0, 15] }}>
          <SubTitle
            css={{
              fontSize: 24,
              lineHeight: '1.5rem',
              marginTop: 12,
              marginBottom: 8,
              padding: 0,
            }}
            $$row
          >
            Sunday, Apr 22<span
              css={{ verticalAlign: 'super', marginTop: -2, fontSize: 12 }}
            >
              nd
            </span>
          </SubTitle>
        </title>
        <section $explore>
          <UI.Button
            icon="menu"
            tooltip="Explore"
            $exploreButton
            {...exploreButton}
          />
          <UI.Button
            icon="userscir"
            tooltip="Directory"
            $exploreButton
            {...exploreButton}
          />
          <UI.Text size={1.1} css={{ width: 'calc(100% - 120px)' }}>
            There have been <strong>4 conversations</strong> on topics you
            follow.
          </UI.Text>
        </section>

        <OrbitDivider />

        <summary>
          <Masonry
            items={appStore.summaryResults}
            itemComponent={MasonryCard}
            alignCenter={true}
            loadingElement={<span>Loading...</span>}
            columnWidth={265}
            columnGutter={10}
            hasMore={false}
            isLoading={false}
            onInfiniteLoad={() => {}}
          />
        </summary>
      </pane>
    )
  }

  static style = {
    pane: {
      padding: [0, 0],
      flex: 1,
    },
    section: {
      padding: [5, 0],
    },
    summary: {
      flex: 1,
      position: 'relative',
      transition: 'opacity ease-in-out 150ms',
      overflowY: 'scroll',
    },
    grid: {
      padding: [0, 5],
      flexFlow: 'row',
      flexWrap: 'wrap',
    },
    cards: {
      flexFlow: 'row',
      flexWrap: 'wrap',
      userSelect: 'none',
      marginBottom: 20,
    },
    verticalSpace: {
      height: 20,
    },
    explore: {
      flexFlow: 'row',
      overflowX: 'scroll',
      padding: [10, 10],
      alignItems: 'center',
    },
    item: {
      flexFlow: 'row',
      alignItems: 'center',
      padding: [8, 15],
      fontSize: 16,
    },
    exploreButton: {
      margin: [0, 8, 0, 3],
    },
  }

  static theme = (props, theme) => {
    return {
      item: {
        '&:hover': {
          background: theme.hover.background,
        },
      },
    }
  }
}
