import { Title, SmallTitle } from '~/views'
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'

@view.ui
export class PostTemplate extends React.Component {
  render({
    paragraphs,
    paragraphProps,
    title,
    titleProps,
    sectionTitle,
    sectionTitleProps,
  }) {
    return (
      <>
        <header>
          <SmallTitle if={sectionTitle} {...sectionTitleProps}>
            {sectionTitle}
          </SmallTitle>
          <Title italic size={2.7} margin={[0, 0, 10, 0]} {...titleProps}>
            {title}
          </Title>
        </header>
        <card>
          <UI.PassProps
            size={1.7}
            sizeLineHeight={1.25}
            alpha={0.8}
            margin={[0, 0, 50]}
            {...paragraphProps}
          >
            {paragraphs}
          </UI.PassProps>
        </card>
      </>
    )
  }

  static style = {
    header: {
      padding: [150, 150, 50],
      textAlign: 'center',
      [Constants.screen.smallQuery]: {
        padding: [0, 0, 20],
      },
    },
    card: {
      background: '#fff',
      borderRadius: 6,
      padding: ['7%', '10%'],
      margin: [0, '10%', 50],
      boxShadow: [[0, 3, 14, [0, 0, 0, 0.1]]],
      [Constants.screen.smallQuery]: {
        margin: [0, -50],
        padding: [40, '10%'],
      },
    },
  }
}
