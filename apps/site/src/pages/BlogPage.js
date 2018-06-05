import { Header, Footer, PostTemplate } from '~/components'
import { Section } from '~/views'
import SectionContent from '~/views/sectionContent'
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'
import { posts } from './blog/posts'

console.log('posts', posts)

@view.ui
export class BlogPage extends React.Component {
  render() {
    return (
      <page $$flex $$background={Constants.blueTheme.background}>
        <UI.Theme theme={Constants.blueTheme}>
          <Header />
          <Section>
            <SectionContent padded>
              <PostTemplate title="Orbit Blog">
                {posts.slice(0, 5).map((post, index) => {
                  const lines = post.split('\n')
                  const title = lines[0].slice(2, Infinity)
                  const preview = lines.slice(1, 10).join('\n')
                  return (
                    <PostTemplate key={index} title={title} body={preview} />
                  )
                })}
              </PostTemplate>
            </SectionContent>
          </Section>
          <Footer noMission />
        </UI.Theme>
      </page>
    )
  }
}
