import * as React from 'react'
import { view, react } from '@mcro/black'
import { SubTitle } from '~/views'
import * as UI from '@mcro/ui'
import { App } from '@mcro/all'
import OrbitCard from './orbitCard'

const rowHeight = 2
const gridGap = 6
const postfix = [
  'st',
  'nd',
  'rd',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'st',
  'nd',
  'rd',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'st',
]

@view
class Masonry extends React.Component {
  state = {
    measured: false,
  }

  componentWillReceiveProps() {
    this.setState({ measured: false })
  }

  setGrid(grid) {
    if (!grid) return
    if (this.state.measured) return
    this.styles = []
    for (const item of Array.from(grid.children)) {
      const content = item.querySelector('.card')
      const contentHeight = content.clientHeight
      const rowSpan = Math.ceil(
        (contentHeight + gridGap) / (rowHeight + gridGap),
      )
      this.styles.push({ gridRowEnd: `span ${rowSpan}` })
    }
    this.setState({ measured: true })
  }

  render() {
    const { measured } = this.state
    const { children, ...props } = this.props
    if (!measured) {
      return (
        <grid ref={ref => this.setGrid(ref)} {...props}>
          {children}
        </grid>
      )
    }
    return (
      <grid
        style={{ gridAutoRows: rowHeight, gridGap, gridColumnGap: 8 }}
        {...props}
      >
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child, {
            style: this.styles[index],
          })
        })}
      </grid>
    )
  }

  static style = {
    grid: {
      minHeight: '100%',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px,1fr))',
    },
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
    const locale = 'en-US'
    const now = new Date()
    const day = now.toLocaleDateString(locale, { weekday: 'long' })
    const month = now.toLocaleDateString(locale, { month: 'short' })
    const dayNum = now.getMonth()

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
        <title>
          <SubTitle $subtitle>
            <span $bolder>{day}</span> {month} {dayNum}
            <span $super>{postfix[dayNum - 1]}</span>
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
          <UI.Text
            size={1.1}
            css={{ width: 'calc(100% - 120px)', marginLeft: 8 }}
          >
            <strong>4</strong> new interesting things on{' '}
            <span
              css={{
                paddingBottom: 2,
                borderBottom: [2, theme.active.background.lighten(0.02)],
              }}
            >
              topics you follow
            </span>.
          </UI.Text>
        </section>

        <summary>
          <Masonry>
            {appStore.summaryResults.map((item, index) => (
              <OrbitCard
                key={index}
                index={index}
                item={item}
                total={appStore.summaryResults.length}
                result={item}
                hoverToSelect
                expanded
                getRef={appStore.setDockedResultRef(index)}
              />
            ))}
          </Masonry>
        </summary>
      </pane>
    )
  }

  static style = {
    pane: {
      padding: [0, 0],
      flex: 1,
    },
    title: { padding: [0, 15] },
    subtitle: {
      fontSize: 26,
      fontWeight: 200,
      lineHeight: '1.5rem',
      marginTop: 16,
      marginBottom: 3,
      padding: 0,
      flexFlow: 'row',
    },
    bolder: {
      fontWeight: 300,
    },
    super: {
      verticalAlign: 'super',
      marginTop: -3,
      marginLeft: 1,
      fontSize: 14,
    },
    section: {
      padding: [5, 0],
    },
    summary: {
      flex: 1,
      position: 'relative',
      transition: 'opacity ease-in-out 150ms',
      overflowY: 'scroll',
      padding: [0, gridGap],
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
      padding: [8, 10, 10],
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
