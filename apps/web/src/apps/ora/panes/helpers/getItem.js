// @flow
import * as React from 'react'
import * as UI from '@mcro/ui'
import * as Helpers from '~/helpers'
import * as Constants from '~/constants'

const getDate = result =>
  result.data && result.data.updated ? UI.Date.format(result.data.updated) : ''

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
  if (result.data && result.data.integration === 'slack') {
    const { messages } = result.data.data
    const showCount = 2
    const more = messages.length - showCount
    return (
      <container css={childrenStyle}>
        <messages style={{ margin: 5 }}>
          {messages.slice(0, showCount).map(({ author, message }) => (
            <message $$row style={{ marginTop: 5 }}>
              <UI.Text size={0.95} ellipse={30}>
                <span style={{ fontWeight: 500, opacity: 0.9 }}>{author}</span>
                <span style={{ opacity: 0.7, marginRight: 5 }}>:</span>
                <span style={{ opacity: 0.7 }}>{message}</span>
              </UI.Text>
            </message>
          ))}
        </messages>
        <UI.Text opacity={0.7} size={0.95} alignSelf="center" if={more > 0}>
          {more} more message{more === 1 ? '' : 's'}
        </UI.Text>
      </container>
    )
  }

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
    // add on the app position to inner position
    if (object) {
      if (!window.lastElectronState) {
        console.error('no state')
        return
      }
      const { oraPosition } = window.lastElectronState
      if (!oraPosition) {
        console.log('error no oraposition sent')
        return
      }
      const [oraX, oraY] = oraPosition
      // not all of pad because it looks nice slightly overlapped
      object.left = object.left + oraX + Constants.ORA_PAD * 0.8
      object.top =
        object.top +
        oraY +
        document.querySelector('.header > .contents').clientHeight +
        document.querySelector('.fade:last-child .pane .content').offsetTop -
        (
          document.querySelector('.fade:last-child .ReactVirtualized__Grid') ||
          document.querySelector('.fade:last-child .list')
        ).scrollTop
    }
    console.log('peekhovered, sending', object)
    Helpers.OS.send('peek-target', object)
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

  if (index === 0) {
    itemProps.highlightBackground = [255, 255, 255, 0.035]
  }

  return itemProps
}
