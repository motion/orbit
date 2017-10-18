// @flow
import * as React from 'react'
import * as UI from '@mcro/ui'
import type { PaneResult } from '~/types'
import FeedItem from '../feed/feedItem'

const hasContent = (result: PaneResult) =>
  result && result.data && result.data.body

const getDate = (result: PaneResult) =>
  result.data && result.data.updated ? UI.Date.format(result.data.updated) : ''

function getIcon(result) {
  if (result.data && result.data.integration === 'github') {
    const num = result.data.data.number
    return (
      <UI.Button circular fontSize={5 / Math.min(5, num.length) * 5 + 10}>
        #{num}
      </UI.Button>
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
    const extra = body.length > 50 ? '...' : ''
    text = getDate(result) + ' · ' + body.slice(0, 30) + extra || ''
  }
  if (!result.data && getDate(result)) {
    text = getDate(result) + ' · '
  }
  // make text even shorter if event exists
  // enventualyl we just need <UI.Text lineClamp={number} />
  if (result.event) {
    text = text.slice(0, 20) + '...'
  }
  if (text) {
    return [
      <UI.Text key={0} lineHeight={20} opacity={0.5}>
        {text}
      </UI.Text>,
      result.event && <FeedItem key={1} inline event={result.event} />,
    ].filter(Boolean)
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
    children: getChildren(result),
    iconAfter: result.iconAfter !== false,
    icon: getIcon(result),
  })
}
