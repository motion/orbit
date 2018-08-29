import { Header, Footer, PostTemplate } from '~/components'
import * as V from '~/views'
import { SectionContent } from '~/views/sectionContent'
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'
import posts from '~/posts'
import { Renderer } from '~/helpers'

console.log('posts', posts)

@view.ui
export class BlogPage extends React.Component {
  render() {
    return (
      <page
        style={{
          overflow: 'hidden',
          flex: 1,
          background: Constants.blueTheme.background,
        }}
      >
        <UI.Theme theme={Constants.blueTheme}>
          <Header />
          <V.Section>
            <SectionContent padded>
              <PostTemplate title="Orbit Blog">
                {posts.slice(0, 5).map((post, index) => {
                  const lines = post.split('\n')
                  const title = lines[0].slice(2, Infinity)
                  const firstLine =
                    lines[lines.slice(1).findIndex(x => x !== '') + 1]
                  const postLink = `/blog/${index}`
                  return (
                    <post>
                      <V.LinkSimple to={postLink}>
                        <V.SubTitle size={2}>{title}</V.SubTitle>
                      </V.LinkSimple>
                      <br />
                      <div style={{ marginBottom: -40 }}>
                        {Renderer.processSync(firstLine).contents}
                      </div>
                    </post>
                  )
                })}
              </PostTemplate>
            </SectionContent>
          </V.Section>
          <Footer noMission />
        </UI.Theme>
      </page>
    )
  }
}
