import { A, P2, SubTitle, SubSubTitle, Title, SmallTitle } from '~/views'
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'
import reactRenderer from 'remark-react'
import remark from 'remark'

const pProps = {
  size: 1.7,
  sizeLineHeight: 1.15,
  alpha: 0.8,
  margin: [0, 0, 50],
}

const P = props => <P2 {...pProps} {...props} />

const Renderer = remark().use(reactRenderer, {
  remarkReactComponents: {
    a: A,
    p: P,
    h1: Title,
    h2: SubTitle,
    h3: SubSubTitle,
    h4: props => <SubTitle size={2.2} {...props} />,
    li: props => (
      <li>
        <P margin={[0, 0, 10]}>{props.children}</P>
      </li>
    ),
    ul: props => <ul css={{ margin: [0, 0, 50, 20] }}>{props.children}</ul>,
    ol: props => <ol css={{ margin: [0, 0, 50, 20] }}>{props.children}</ol>,
  },
})

@view.ui
export class PostTemplate extends React.Component {
  render({
    body,
    paragraphs,
    paragraphProps,
    title,
    titleProps,
    sectionTitle,
    sectionTitleProps,
    children,
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
          <body if={body}>{Renderer.processSync(body).contents}</body>
          <UI.PassProps if={paragraphs} {...pProps} {...paragraphProps}>
            {paragraphs}
          </UI.PassProps>
          {children}
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
      padding: ['7%', '8%'],
      margin: [0, '10%', 50],
      boxShadow: [[0, 3, 14, [0, 0, 0, 0.1]]],
      [Constants.screen.smallQuery]: {
        margin: [0, -50],
        padding: [40, '10%'],
      },
    },
  }
}
