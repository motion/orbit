// @flow
import * as React from 'react'
import * as UI from '@mcro/ui'
import * as Helpers from '~/helpers'

const INTEGRATION_ICONS = {
  pin: 'pin',
  'pin-site': 'pin',
  slack: 'social-slack',
  github: 'social-github',
  google: 'social-google',
}

function getIcon(result) {
  if (result.data && INTEGRATION_ICONS[result.data.integration]) {
    return INTEGRATION_ICONS[result.data.integration]
  }
  return result.icon
}

const childrenStyle = {
  marginLeft: 6,
  borderLeft: [1, 'dotted', [255, 255, 255, 0.15]],
  padding: [0, 10],
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

function getLocation(thing) {
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
  let location = null
  if (result.subtitle) {
    // origin url is in data.integration
    if (text) {
      text = `"${result.subtitle}" · ${text}`
    } else {
      text = result.subtitle
    }
  }
  if (thing && getLocation(thing)) {
    // origin url is in data.integration
    location = `${getLocation(thing)}`
  }
  if (location) {
    text = (
      <span $$ellipse>
        in {location}
        {text ? ` · ${text}` : ''}
      </span>
    )
  }
  return text
}

const getHoverProps = Helpers.hoverSettler({
  enterDelay: 600,
  onHovered: object => {
    console.log('hovered', object)
  },
})

export default function getItem(result, index) {
  // peek hover props
  let hoverProps
  if (result.peek !== false && result.data) {
    hoverProps = getHoverProps({
      url: result.data && result.data.url,
      id: result.id,
    })
  }
  const itemProps = {
    key: `${index}${result.id}`,
    beforePrimary: (
      <InlineIcon
        if={getIcon(result)}
        size={16}
        name={getIcon(result)}
        css={{ alignSelf: 'flex-start', margin: [4, 8, 0, 0], opacity: 0.5 }}
      />
    ),
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
      css: childrenStyle,
    },
    date: result.date,
    after: result.after,
    before: result.before,
    below: result.below,
    beforeProps: result.beforeProps,
    afterProps: result.afterProps,
    selectable: result.selectable,
    glow: result.glow || result.selectable !== false,
    ...hoverProps,
    ...result.props,
  }
  return itemProps
}
