import * as React from 'react'
import { view, react } from '@mcro/black'
import { SubTitle, RoundButton } from '~/views'
import * as UI from '@mcro/ui'
import { App } from '@mcro/all'
import OrbitCard from './orbitCard'

const roundBtnProps = {
  fontSize: 15,
  sizePadding: 1.5,
  sizeHeight: 1,
  sizeRadius: 0.9,
  margin: [0, 1],
}

const rowHeight = 2
const gridGap = 6
const gridColumnGap = 8
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
        style={{ gridAutoRows: rowHeight, gridGap, gridColumnGap }}
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
    const day = now.toLocaleDateString(locale, { weekday: 'short' })
    const month = now.toLocaleDateString(locale, { month: 'short' })
    const dayNum = now.getMonth()
    const buttonColor = theme.base.color.darken(0.15)
    const exploreButton = {
      size: 1.2,
      circular: true,
      borderWidth: 0,
      borderColor: theme.base.borderColor,
      background: theme.base.background,
      iconProps: {
        color: buttonColor,
        size: 14,
      },
    }
    return (
      <pane css={{ background: theme.base.background }}>
        <section $explore>
          <UI.Button
            icon="menu"
            tooltip="Explore"
            $exploreButton
            css={{ marginLeft: -2 }}
            {...exploreButton}
          />
          <UI.Button
            icon="userscir"
            tooltip="Directory"
            $exploreButton
            {...exploreButton}
          />
          <space $$flex />
          <UI.Text size={1.15} css={{ margin: [0, 15] }}>
            <strong>4</strong> new from{' '}
            <span
              css={{
                paddingBottom: 2,
                borderBottom: [2, theme.active.background.lighten(0.02)],
              }}
            >
              your filters
            </span>.
          </UI.Text>
        </section>

        <section $filterSection>
          <title>
            <SubTitle $subtitle>
              {day} {month} {dayNum}
              <span $super>{postfix[dayNum - 1]}</span>
            </SubTitle>
          </title>
          <div $$flex />
          <filters>
            {['all', 'general', 'status', 'showoff'].map((name, index) => (
              <RoundButton {...roundBtnProps} key={index} active={index === 0}>
                {name}
              </RoundButton>
            ))}
            <RoundButton
              {...roundBtnProps}
              sizePadding={1.3}
              icon="arrowsmalldown"
              iconProps={{
                color: theme.active.background.darken(0.15),
                style: { marginTop: 3 },
              }}
            />
          </filters>
        </section>

        <summary>
          <Masonry>
            {appStore.summaryResults.map((bit, index) => (
              <OrbitCard
                pane="summary"
                key={index}
                index={index}
                bit={bit}
                total={appStore.summaryResults.length}
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
      flex: 1,
    },
    bolder: {
      // fontSize: 22,
      // fontWeight: 200,
    },
    super: {
      verticalAlign: 'super',
      marginLeft: 1,
      fontSize: 11,
      opacity: 0.6,
    },
    section: {
      padding: [5, 0],
    },
    summary: {
      flex: 1,
      position: 'relative',
      transition: 'opacity ease-in-out 150ms',
      overflowY: 'scroll',
      padding: [0, gridColumnGap],
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
      width: '100%',
      flexFlow: 'row',
      padding: [10, 8, 4],
      alignItems: 'center',
    },
    item: {
      flexFlow: 'row',
      alignItems: 'center',
      padding: [8, 15],
      fontSize: 16,
    },
    exploreButton: {
      margin: [0, 3, 0, 0],
    },
    filterSection: {
      flexFlow: 'row',
      alignItems: 'center',
      padding: [0, 15, 15],
    },
    title: {
      padding: [0, 15, 0, 0],
    },
    subtitle: {
      fontSize: 16,
      fontWeight: 300,
      lineHeight: '1.5rem',
      margin: 0,
      padding: 0,
      flexFlow: 'row',
    },
    filters: {
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'center',
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
