import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { SubTitle } from '~/views'

@view
export default class FeedRecently {
  render() {
    const itemProps = {
      padding: [6, 0, 5, 6],
      borderRadius: 6,
      size: 1.2,
      background: 'transparent',
      margin: [0, 12, 0, 5],
      css: {
        '&:hover': {
          background: [0, 0, 0, 0.05],
        },
      },
      primaryProps: {
        opacity: 0.8,
      },
    }

    return (
      <recently>
        {[1, 2].map(i => (
          <SubTitle key={i} $title $titleBackground={i === 1} marginBottom={0}>
            Recently
          </SubTitle>
        ))}
        <bg />
        <UI.List
          horizontal
          itemProps={itemProps}
          items={[
            {
              primary: 'Some Doc',
              icon: '/images/google-docs-icon.svg',
            },
            {
              primary: '#general',
              icon: 'social-slack',
            },
            { primary: 'motion/orbit', icon: '/images/github-icon.svg' },
            { primary: 'motion/something', icon: '/images/github-icon.svg' },
          ]}
        />
      </recently>
    )
  }

  static style = {
    recently: {
      padding: [13, 20],
      alignItems: 'center',
      flexFlow: 'row',
      borderBottom: [1, [0, 0, 0, 0.08]],
      flex: 1,
      position: 'relative',
    },
    bg: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#fafafa',
    },
    title: {
      fontSize: 12,
      position: 'absolute',
      top: -10,
      padding: [3, 10],
      border: [1, 'transparent'],
      borderRadius: 6,
      color: '#aaa',
      zIndex: 1,
    },
    titleBackground: {
      background: '#f9f9f9',
      border: [1, [0, 0, 0, 0.08]],
      zIndex: -1,
      color: 'transparent',
    },
  }
}
