import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { SubTitle } from '~/views'

@view
export default class FeedRecently {
  render() {
    const itemProps = {
      padding: [7],
      paddingRight: 0,
      borderRadius: 5,
      size: 1.2,
      background: 'transparent',
      margin: [0, 12, 0, 5],
      css: {
        '&:hover': {
          background: [0, 0, 0, 0.1],
        },
      },
      primaryProps: {
        fontWeight: 400,
      },
    }

    return (
      <recently>
        <SubTitle
          css={{
            position: 'absolute',
            top: -10,
            background: '#f9f9f9',
            padding: [2, 12],
            marginLeft: -2,
            borderRadius: 8,
            color: '#aaa',
          }}
          marginBottom={0}
        >
          Recent
        </SubTitle>
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
      padding: [15, 20],
      alignItems: 'center',
      flexFlow: 'row',
      background: '#fafafa',
      borderBottom: [1, [0, 0, 0, 0.08]],
      flex: 1,
    },
  }
}
