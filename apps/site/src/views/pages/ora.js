import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import SidebarTitle from './sidebarTitle2'
import { throttle } from 'lodash'
import { ORA_BORDER_RADIUS, ORA_HEIGHT, ORA_WIDTH } from '~/constants'

const allItems = {
  0: [
    {
      children: (
        <SidebarTitle
          title="A smart assistant for your company"
          subtitle="Orbit is a simple, always on app that provides relevant"
          icon="globe"
          noBack
        />
      ),
    },
    {
      primary: 'Unified',
      children:
        'All your company knowledge, at your fingertips when you need it most.',
      icon: 'hand',
      category: 'Results',
    },
    {
      primary: 'Powerful',
      children:
        'Advanced machine learning combined with an innovative interface makes your life easy.',
      icon: 'car',
      category: 'Results',
    },
    {
      primary: 'Secure',
      children:
        'Orbit works without leaking any of your data, even to our servers.',
      icon: 'lock',
      category: 'Results',
    },
  ],
  1: [
    {
      children: (
        <SidebarTitle
          title="Hands-free Intelligence"
          subtitle="An assistant that's always there, not hidden in a tab or bot"
          icon="think"
          noBack
        />
      ),
    },
    {
      primary: 'Integrations',
      children:
        'Not just your knowledgebase or wiki, but your docs, Slack conversations, and more.',
      icon: 'social-slack',
      category: 'Results',
    },
    {
      primary: 'Contextual',
      children: `With a keystroke you can see whats relevant to whatever you're currently doing, whether writing an email, document, or having a conversation.`,
      icon: 'brain',
      category: 'Results',
    },
  ],
  2: [
    {
      children: (
        <SidebarTitle
          title="The No-Cloud Infrastructur"
          subtitle="In order to work, Orbit needed to invent a new model"
          icon="think"
          noBack
        />
      ),
    },
    {
      primary: 'Uses your Permissions',
      children:
        'Orbit authenticates using your personal permissions, so it never can expose the wrong thing.',
      icon: 'lock',
      category: 'Results',
    },
    {
      primary: 'Not on premise',
      children:
        'Orbit runs securely on your device, without sending any data outside your computer.',
      icon: 'lock',
      category: 'Results',
    },
  ],
}

@view
export default class Ora extends React.Component {
  state = {
    lastIntersection: -1,
  }

  componentDidMount() {
    const update = lastIntersection => {
      if (this.state.lastIntersection !== lastIntersection) {
        this.setState({ lastIntersection })
      }
    }

    const { node, bounds } = this.props
    this.on(
      node,
      'scroll',
      throttle(() => {
        if (node.scrollTop < 200) {
          update(0)
        } else {
          const bottom = window.innerHeight + node.scrollTop
          for (let i = bounds.length - 1; i > -1; i--) {
            const bound = bounds[i]
            if (!bound) continue
            if (bound.top + window.innerHeight / 2 < bottom) {
              update(i)
              break
            }
          }
        }
      }, 100)
    )

    this.setState({ lastIntersection: 0 })
  }

  render() {
    const items = allItems[this.state.lastIntersection]
    if (window.innerWidth < 800) {
      return null
    }
    return (
      <UI.Theme name="dark">
        <ora
          css={{
            position: 'fixed',
            top: 20,
            right: 20,
            width: ORA_WIDTH,
            height: ORA_HEIGHT,
            // borderRadius: 10,
            userSelect: 'none',
            background: [40, 40, 40, 0.9],
            borderRadius: ORA_BORDER_RADIUS,
            color: '#fff',
            zIndex: 10000,
            boxShadow: [
              '0 0 10px rgba(0,0,0,0.25)',
              'inset 0 0 100px 30px #252525',
            ],
          }}
        >
          <header css={{ padding: 10, opacity: 0.25 }}>
            <UI.Icon name="zoom" />
          </header>
          <content css={{ padding: 0 }}>
            <UI.List
              itemProps={{ padding: [10, 10], glow: true }}
              key={this.state.lastIntersection}
              groupKey="category"
              items={items}
            />
          </content>
        </ora>
      </UI.Theme>
    )
  }
}
