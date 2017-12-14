// @flow
import * as React from 'react'
import * as UI from '@mcro/ui'
import { OS } from '~/helpers'
import { isEqual } from 'lodash'

const getDate = result =>
  result.data && result.data.updated ? UI.Date.format(result.data.updated) : ''

const INTEGRATION_ICONS = {
  github: 'social-github',
  google: 'social-google',
  'google-docs': 'social-google',
  'pin-site': 'pin',
}

function getIcon(result) {
  if (result.data && result.data.integration === 'github') {
    return INTEGRATION_ICONS[result.data.integration]
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
      return thing.host
    case 'pin-site':
      return thing.host
  }
}

function getSecondary(result) {
  const thing = result.data
  let text = ''
  let icon = null
  if (thing) {
    if (ICON_NAME[thing.integration]) {
      icon = <InlineIcon name={ICON_NAME[thing.integration]} />
    }
    if (thing.updated) {
      text = getDate(result)
    }
  }
  if (result.subtitle) {
    // origin url is in data.integration
    if (text) {
      text = `"${result.subtitle}" · ${text}`
    } else {
      text = result.subtitle
    }
  }
  if (thing && location(thing)) {
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

const PEEK_HOVER_DELAY = 600

let lastEnter
let lastLeave
let currentNode
let lastPeek

const setPeek = object => {
  OS.send('peek', object)
  lastPeek = object
}

export default function getItem(result, index) {
  let itemLastEnter
  let itemLastLeave

  function handleHover(_, target) {
    clearTimeout(lastEnter)
    clearTimeout(lastLeave)
    // dont delay at all if were already peeking
    const isAlreadyPeeking = !!currentNode
    const delay = isAlreadyPeeking ? 0 : PEEK_HOVER_DELAY
    itemLastEnter = lastEnter = setTimeout(() => {
      currentNode = target
      const url = result.data && result.data.url
      if (!currentNode) {
        return
      }
      const offsetTop =
        currentNode.offsetTop +
        document.querySelector('.header > .contents').clientHeight +
        document.querySelector('.fade:last-child .pane .content').offsetTop -
        (
          document.querySelector('.fade:last-child .ReactVirtualized__Grid') ||
          document.querySelector('.fade:last-child .list')
        ).scrollTop

      const nextPeek = { url, offsetTop, id: result.id }

      if (!isEqual(nextPeek, lastPeek)) {
        setPeek(nextPeek)
      }
    }, delay)
  }

  function onMouseEnter(e) {
    handleHover(e, e.currentTarget)
  }

  function onMouseMove(e) {
    handleHover(e, e.currentTarget)
  }

  function onMouseLeave() {
    clearTimeout(lastEnter)
    clearTimeout(itemLastLeave)
    itemLastLeave = setTimeout(() => {
      if (itemLastEnter === lastEnter) {
        setPeek(null)
        itemLastEnter = null
        currentNode = null
      }
    }, 50)
  }

  // peek hover props
  let peekProps
  if (result.peek !== false && result.data) {
    peekProps = {
      onMouseEnter,
      onMouseMove,
      onMouseLeave,
    }
  }

  return {
    key: `${index}${result.id}${result.title}${result.category}`,
    primary: result.title,
    primaryEllipse: index === 0 ? 2 : true,
    primaryProps: {
      // lower opacity as list items go down
      alpha: Math.max(0.5, (9 - index) / 8),
      size: 1.2,
      fontWeight: 500,
    },
    secondary: getSecondary(result),
    children: getChildren(result),
    childrenProps: {
      alpha: Math.max(0.25, (9 - index) / 16),
      ellipse: index < 2 ? 3 : 2,
      size: 1.1,
      highlightWords: result.highlightWords,
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
    ...peekProps,
    ...result.props,
  }
}
