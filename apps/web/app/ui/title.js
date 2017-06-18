// @flow
import React from 'react'
import { view } from '@jot/black'

export type Props = {
  tag: string,
  children: React$Element | string,
}

@view.ui
export default class Title {
  static defaultProps = {
    tag: 'h1',
  }

  render({ tag, children, ...props }: Props) {
    return React.createElement(tag, { $title: true, ...props }, children)
  }

  static style = {
    title: {
      fontWeight: 600,
      margin: ['0.5rem', 0],
      flexFlow: 'row',
      display: 'flex',
      whiteSpace: 'pre',
    },
  }

  static theme = {
    tag: ({ tag, size }) => {
      const reduce = 1 / +tag.slice(1)
      const fontSize = +size || 20 + reduce * 20
      return {
        title: {
          fontSize,
          lineHeight: `${1 + fontSize * 0.06}rem`,

          '&:hover': {
            color: tag === 'a' ? 'red' : 'auto',
          },
        },
      }
    },
    sans: {
      title: {
        fontFamily: 'sans-serif',
      },
    },
    spaced: {
      title: {
        margin: ['1.5rem', 0],
      },
    },
  }
}
