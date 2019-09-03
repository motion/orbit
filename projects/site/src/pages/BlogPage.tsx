import { Space } from '@o/ui'
import { compose, mount, route, withView } from 'navi'
import React from 'react'
import { View } from 'react-navi'

import { Header } from '../Header'
import { ContentSection } from '../views/ContentSection'
import { FadeParent } from '../views/FadeInView'
import { MDX } from '../views/MDX'
import { SectionContent } from '../views/SectionContent'
import { TitleText } from '../views/TitleText'
import { BlogFooter } from './BlogPage/BlogLayout'
import { BlogPageIndex, PostMeta } from './BlogPage/BlogPageIndex'
import { posts } from './BlogPage/posts'
import { PostEntry } from './BlogPage/PostEntry'
import { BlogTitle } from './BlogTitle'

export default compose(
  withView(() => {
    return (
      <BlogPage>
        <View />
      </BlogPage>
    )
  }),

  mount({
    '/': route({
      title: 'Blog',
      view: BlogPageIndex,
    }),
    '/:id': route(async req => {
      let id = req.params.id
      if (!posts[id]) {
        return {
          // todo
          view: () => <div>not found</div>,
        }
      }
      let ChildView = (await posts[id].view()).default
      return {
        view: (
          <PostPage post={posts[id]}>
            <ChildView />
          </PostPage>
        ),
      }
    }),
  }),
)

export function BlogPage(props: { title?: string; children?: any }) {
  return (
    <FadeParent>
      <MDX>
        <Header slim noBorder />
        <main className="main-contents">{props.children}</main>
      </MDX>
    </FadeParent>
  )
}

BlogPage.theme = 'light'

function PostPage(props: { post: PostEntry; children?: any }) {
  return (
    <>
      <BlogTitle paddingTop={50} />
      <SectionContent>
        <ContentSection>
          <TitleText size="xxl">{props.post.title}</TitleText>
          <Space />
          <PostMeta post={props.post} />
          <Space />
          <Space />
          {props.children}
        </ContentSection>
      </SectionContent>
      <BlogFooter />
    </>
  )
}
