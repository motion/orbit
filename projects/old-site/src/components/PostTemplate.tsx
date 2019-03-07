import { gloss } from '@o/gloss'
import * as UI from '@o/ui'
import * as React from 'react'
import * as Constants from '../constants'
import { pProps, Renderer } from '../helpers'
import { SmallTitle, Title } from '../views'

const Post = gloss({
  position: 'relative',
})

const Header = gloss({
  zIndex: 0,
  padding: [150, 150, 50],
  textAlign: 'center',
  [Constants.screen.smallQuery]: {
    padding: [0, 0, 20],
  },
})

const Card = gloss({
  background: '#fff',
  borderRadius: 6,
  padding: ['7%', '8%'],
  margin: [0, '10%', 50],
  boxShadow: [[0, 3, 14, [0, 0, 0, 0.1]]],
  [Constants.screen.smallQuery]: {
    margin: [0, -50],
    padding: [40, '10%'],
  },
})

export class PostTemplate extends React.Component {
  render() {
    const {
      body,
      paragraphs,
      paragraphProps,
      title,
      titleProps,
      sectionTitle,
      sectionTitleProps,
      children,
    } = this.props
    return (
      <Post>
        <Header>
          {!!sectionTitle && <SmallTitle {...sectionTitleProps}>{sectionTitle}</SmallTitle>}
          <Title italic size={2.7} margin={[0, 0, 10, 0]} {...titleProps}>
            {title}
          </Title>
        </Header>
        <Card>
          {!!body && <div>{Renderer.processSync(body).contents}</div>}
          {!!paragraphs && (
            <UI.PassProps {...pProps} {...paragraphProps}>
              {paragraphs}
            </UI.PassProps>
          )}
          {children}
        </Card>
      </Post>
    )
  }
}
