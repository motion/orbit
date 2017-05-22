import React from 'react'
import { clr, view } from '~/helpers'
import Icon from './icon'
import Grain from './grain'
import Tabs from './tabs'

@view.ui
export class Title {
  // stop propagation so it doesn't include the click in the dblclick
  onClick = e => {
    const { onCollapse } = this.props
    e.stopPropagation()
    onCollapse(e)
  }

  render() {
    const {
      children,
      collapsable,
      collapsed,
      onCollapse,
      before,
      after,
      sub,
      hoverable,
      background,
      stat,
      ...props
    } = this.props

    return (
      <ptitle onDoubleClick={onCollapse} {...props}>
        <collapse
          if={collapsable}
          onClick={this.onClick}
          onDoubleClick={this.onClick}
        >
          <Icon
            name={collapsed ? 'arrow-bold-right' : 'arrow-bold-down'}
            color="#ccc"
            size={8}
          />
        </collapse>
        <before if={before}>{before}</before>
        <content>
          {children} <stat if={stat}>{stat}</stat>
        </content>
        <after if={after}>{after}</after>
        {/* bugfix: having onDoubleClick here as well forces this to trigger when toggling fast */}
      </ptitle>
    )
  }

  static style = {
    ptitle: {
      padding: [2, 10],
      background: '#fafafa',
      borderBottom: [1, 'dotted', '#eee'],
      color: [0, 0, 0, 0.5],
      flexFlow: 'row',
      alignItems: 'center',
      fontSize: 12,
      fontWeight: 700,
      userSelect: 'none',
    },
    content: {
      flex: 1,
      flexFlow: 'row',
      alignItems: 'center',
    },
    collapse: {
      padding: [5, 5, 4, 5],
      marginRight: 5,
      marginLeft: -5,
      borderRadius: 3,
      alignItems: 'center',
      '&:hover': {
        background: [0, 0, 0, 0.02],
      },
    },
    stat: {
      fontSize: 11,
      marginLeft: 5,
      opacity: 0.3,
    },
  }

  static theme = {
    sub: {
      ptitle: {
        padding: [2, 5],
        color: [255, 255, 255, 0.5],
        fontWeight: 300,
      },
    },
    background: ({ background, hoverable }) => ({
      ptitle: {
        background,
        '&:hover': {
          background: hoverable ? clr(background).lighten(0.025) : background,
        },
      },
    }),
  }
}

@view.ui
export default class Pane {
  static Title = Title

  props: {
    collabsable: boolean,
    onSetCollapse: Function,
    activeTab: number,
  }

  static defaultProps = {
    collapsable: false,
    onSetCollapse: () => {},
    activeTab: 0,
  }

  constructor(props) {
    this.state = {
      collapsed: false,
      selectedTab: props.tabs ? props.tabs[props.activeTab] : null,
    }
  }

  componentWillMount() {
    this.setCollapsed(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setCollapsed(nextProps)
  }

  setCollapsed = ({ collapsed }) => {
    this.setState({ collapsed })
  }

  handleCollapse = () => {
    if (this.props.collapsable) {
      const collapsed = !this.state.collapsed
      this.props.onSetCollapse(collapsed)
      this.setState({ collapsed })
    }
  }

  handleTabChange = selectedTab => {
    if (this.props.onChangeTab) {
      this.props.onChangeTab(selectedTab)
    }
    this.setState({ selectedTab })
  }

  render() {
    const {
      collapsable,
      title,
      titleProps,
      height,
      children,
      sub,
      light,
      noflex,
      maxHeight,
      minHeight,
      onSetCollapse,
      onChangeTab,
      activeTab,
      titleStat,
      tabs,
      scrollable,
      collapsed: _collapsed,
      padded,
      after,
      ...props
    } = this.props

    const { collapsed, selectedTab } = this.state
    const collapseHeight = 27

    return (
      <section
        $height={height}
        $maxHeight={collapsed ? collapseHeight : maxHeight || 'auto'}
        $minHeight={collapsed ? collapseHeight : minHeight}
        {...props}
      >
        <Tabs
          if={tabs}
          $tabs
          onChange={this.handleTabChange}
          active={tabs.indexOf(activeTab)}
          after={after}
        >
          {tabs}
        </Tabs>
        <Title
          if={title}
          $noCollapsable={!collapsable}
          collapsable={collapsable}
          collapsed={collapsed}
          onCollapse={this.handleCollapse}
          sub={sub}
          stat={titleStat}
          after={after}
          {...titleProps}
        >
          {title}
        </Title>
        <content $hide={collapsed}>
          {typeof children === 'function' ? children(selectedTab) : children}
        </content>
      </section>
    )
  }

  static style = {
    section: {
      flex: 1,
      overflow: 'hidden',
    },
    height: height => ({
      flex: 'auto',
      height,
    }),
    maxHeight: maxHeight => ({
      maxHeight,
    }),
    minHeight: minHeight => ({
      minHeight,
    }),
    hide: {
      display: 'none',
    },
    noCollapsable: {
      paddingLeft: 10,
    },
    content: {
      flex: 1,
      position: 'relative',
    },
    tabs: {
      borderBottom: [1, [0, 0, 0, 0.15]],
    },
  }

  static theme = {
    maxHeight: ({ maxHeight }) => ({
      content: {
        maxHeight: maxHeight,
        overflowY: 'auto',
        flex: 1,
      },
    }),
    padded: ({ padded }) => ({
      content: {
        padding: padded === true ? 10 : padded,
      },
    }),
    sub: {
      section: {
        background: '#eee',
      },
      content: {
        background: '#fff',
      },
    },
    noflex: {
      section: {
        flex: 'none',
      },
    },
    scrollable: {
      content: {
        overflowY: 'auto',
      },
    },
  }
}
