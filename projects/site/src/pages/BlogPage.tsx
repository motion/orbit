import { Col, Title } from '@o/ui'
import { compose, mount, route, withView } from 'navi'
import React from 'react'
import { View } from 'react-navi'
import { Header } from '../views/Header'
import { MDX } from '../views/MDX'
import { SectionContent } from '../views/SectionContent'
import { BlogPageIndex } from './BlogPage/BlogPageIndex'
import { PostEntry, posts } from './BlogPage/posts'

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

function BlogPage(props: { title?: string; children?: any }) {
  return (
    <MDX>
      <Header slim />
      {props.children}
    </MDX>
  )
}

BlogPage.theme = 'light'

function PostPage(props: { post: PostEntry; children?: any }) {
  return (
    <SectionContent>
      <Col pad="xl" maxWidth={800} margin="auto">
        <Title>{props.post.title}</Title>
        {props.children}
      </Col>
    </SectionContent>
  )
}
