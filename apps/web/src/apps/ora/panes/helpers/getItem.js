// @flow
import * as React from 'react'
import * as UI from '@mcro/ui'

const hasContent = result => result && result.data && result.data.body
const getDate = result =>
  result.data && result.data.updated ? UI.Date.format(result.data.updated) : ''

function getIcon(result) {
  if (result.data && result.data.integration === 'github') {
    const num = result.data.data.number
    return (
      <icon $$centered>
        <UI.Button size={0.8} circular>
          {num}
        </UI.Button>
        <br />
        <UI.Icon name="github" />
      </icon>
    )
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
  if (typeof result.children !== 'undefined') {
    return result.children
  }
  let text
  if (result.data && result.data.body) {
    const body = result.data.body
    text = getDate(result) + ' · ' + body
  }
  if (!result.data && getDate(result)) {
    text = getDate(result) + ' · '
  }
  if (text) {
    return text
    // <FeedItem key={1} inline event={result.event} />
  }
  return null
}

export default function getItem(result, index) {
  return {
    key: `${index}${result.id}${result.title}${result.category}`,
    primary:
      typeof result.displayTitle !== 'undefined'
        ? result.displayTitle || null
        : result.display ? null : result.title,
    primaryEllipse: !hasContent(result) ? 2 : false,
    primaryProps: {
      // lower opacity as list items go down
      opacity: Math.max(0.5, (9 - index) / 8),
      size: 1.2,
      fontWeight: 500,
    },
    secondary: result.subtitle,
    children: getChildren(result),
    childrenProps: {
      opacity: Math.max(0.25, (9 - index) / 16),
      ellipse: index < 2 ? 3 : 2,
      size: 1.1,
    },
    iconAfter: result.iconAfter,
    icon: getIcon(result),
    date: result.date,
    after: result.after,
    before: result.before,
    below: result.below,
    beforeProps: result.beforeProps,
    afterProps: result.afterProps,
    ...result.props,
  }
}
