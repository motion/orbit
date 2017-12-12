// @flow
import * as React from 'react'
import * as UI from '@mcro/ui'
import { OS } from '~/helpers'

const getDate = result =>
  result.data && result.data.updated ? UI.Date.format(result.data.updated) : ''

function getIcon(result) {
  if (result.data && result.data.integration === 'github') {
    // const num = result.data.data.number
    // return (
    //   <icon $$centered>
    //     <UI.Button size={0.8} circular>
    //       {num}
    //     </UI.Button>
    //     <br />
    //     <UI.Icon name="github" />
    //   </icon>
    // )
  }
  if (result.data && result.data.image) {
    return (
      <img
        style={{
          width: 20,
          height: 20,
          borderRadius: 1000,
          margin: 'auto',
        }}
        src={`/images/${result.data.image}`}
      />
    )
  }
  return result.icon
}

function getChildren(result) {
  if (typeof result.children === 'string') {
    return result.children.slice(0, 200).replace(/\s{2,}|\w{30,}/g, ' ... ')
  }
  if (result.children) {
    return result.children
  }
}

const InlineIcon = props => (
  <UI.Icon css={{ display: 'inline' }} size={10} {...props} />
)

const ICON_NAME = {
  pin: 'pin',
  'pin-site': 'pin',
  slack: 'social-slack',
  github: 'social-github',
}

function location(thing) {
  switch (thing.integration) {
    case 'slack':
      return `#${thing.data.channel}`
    case 'pin':
    case 'pin-site':
      return thing.data.host
  }
}

function getSecondary(result) {
  const thing = result.data
  if (!thing) {
    return null
  }
  let text = ''
  let icon = null
  if (ICON_NAME[thing.integration]) {
    icon = <InlineIcon name={ICON_NAME[thing.integration]} />
  }
  if (thing.updated) {
    text = getDate(result)
  }
  if (location(thing)) {
    // origin url is in data.integration
    text = `${location(thing)} · ${text}`
  }
  if (icon) {
    text = (
      <span $$ellipse>
        via {icon} · {text}
      </span>
    )
  }
  return text
}

let lastHover

export default function getItem(result, index) {
  let itemLastHover
  let itemLastLeave
  return {
    key: `${index}${result.id}${result.title}${result.category}`,
    primary:
      typeof result.displayTitle !== 'undefined'
        ? result.displayTitle || null
        : result.display ? null : result.title,
    primaryEllipse: index === 0 ? 2 : true,
    primaryProps: {
      // lower opacity as list items go down
      alpha: Math.max(0.5, (9 - index) / 8),
      size: 1.2,
      fontWeight: 500,
    },
    secondary: result.subtitle || getSecondary(result),
    children: getChildren(result),
    childrenProps: {
      alpha: Math.max(0.25, (9 - index) / 16),
      ellipse: index < 2 ? 3 : 2,
      size: 1.1,
      highlightWords: [
        'company',
        'travel',
        'section',
        'app',
        'squad',
        'financial',
        'sensitive',
        'what',
        'scenario',
      ],
    },
    iconAfter: result.iconAfter,
    icon: getIcon(result),
    date: result.date,
    after: result.after,
    before: result.before,
    below: result.below,
    beforeProps: result.beforeProps,
    afterProps: result.afterProps,
    selectable: result.selectable,
    glow: result.glow || result.selectable !== false,
    onMouseEnter: e => {
      clearTimeout(lastHover)
      const { offsetTop } = e.target.parentNode
      itemLastHover = lastHover = setTimeout(() => {
        const url = result.data && result.data.url
        OS.send('peek', { url, offsetTop, id: result.id })
      }, 100)
    },
    onMouseLeave: () => {
      clearTimeout(itemLastLeave)
      itemLastLeave = setTimeout(() => {
        if (itemLastHover === lastHover) {
          OS.send('peek', null)
          itemLastHover = null
        }
      })
      clearTimeout(lastHover)
    },
    ...result.props,
  }
}
