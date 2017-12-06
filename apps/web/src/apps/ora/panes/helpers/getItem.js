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
  if (typeof result.children === 'string') {
    return result.children.slice(0, 200).replace(/\s{2,}|\w{10,}/g, ' ... ')
  }
  if (result.children) {
    return result.children
  }
}

export default function getItem(result, index) {
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
    secondary: result.subtitle || (result.data && result.data.url),
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
    ...result.props,
  }
}
