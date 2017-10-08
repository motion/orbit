import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { SubTitle } from '~/views'

@view
export default class FeedRecently {
  render() {
    const itemProps = {
      padding: [7, 0],
      size: 1.1,
      background: 'transparent',
      margin: [0, 8, 0, 5],
      primaryProps: {
        fontWeight: 400,
        opacity: 0.6,
      },
    }

    return (
      <recently>
        <SubTitle marginBottom={0}>Recently: &nbsp;</SubTitle>
        <UI.List
          horizontal
          itemProps={itemProps}
          items={[
            {
              primary: 'Some Doc',
              icon: '/images/google-docs-icon.svg',
            },
            {
              primary: 'User Research',
              icon: '/images/google-docs-icon.svg',
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
      padding: [12, 20, 14],
      alignItems: 'center',
      flexFlow: 'row',
      background: '#fafafa',
      borderBottom: [1, '#eee'],
      flex: 1,
    },
  }
}
