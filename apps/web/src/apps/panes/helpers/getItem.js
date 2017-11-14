// @flow
import * as React from 'react'
import * as UI from '@mcro/ui'
import type { PaneResult } from '~/types'

const hasContent = (result: PaneResult) =>
  result && result.data && result.data.body

const getDate = (result: PaneResult) =>
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

export default function getItem(getActiveIndex) {
  return (result, index) => ({
    key: `${index}${result.id}`,
    highlight: () => index === getActiveIndex(),
    primary:
      typeof result.displayTitle !== 'undefined'
        ? result.displayTitle || null
        : result.display ? null : result.title,
    primaryEllipse: !hasContent(result),
    primaryProps: {
      fontWeight: 500,
    },
    secondary: result.subtitle,
    children: getChildren(result),
    iconAfter: result.iconAfter,
    icon: getIcon(result),
    date: result.date,
    after: result.after,
    before: result.before,
    below: result.below,
    beforeProps: result.beforeProps,
    afterProps: result.afterProps,
    ...result.props,
  })
}
