import { Col, Space } from '@o/ui'
import { compose, mount, route, withView } from 'navi'
import React from 'react'
import { Link, View } from 'react-navi'
import { Header } from '../views/Header'
import { MDX } from '../views/MDX'
import { SectionContent } from '../views/SectionContent'
import { TitleText } from '../views/TitleText'
import { BlogFooter } from './BlogPage/BlogLayout'
import { BlogPageIndex } from './BlogPage/BlogPageIndex'
import { PostEntry, posts } from './BlogPage/posts'
import { Wavy } from './HomePage/EarlyAccessBetaSection'

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
    <>
      <SectionContent>
        <BlogTitle />
        <Col pad="xxxl" maxWidth={800} margin="auto" fontSize={20} lineHeight={32}>
          <TitleText size="xxl">{props.post.title}</TitleText>
          <Space />
          {props.children}
        </Col>
      </SectionContent>
      <BlogFooter />
    </>
  )
}

export const BlogTitle = () => (
  <>
    <Space />
    <Link href="/blog" style={{ textDecoration: 'none', cursor: 'pointer' }}>
      <Col pad position="relative" cursor="pointer">
        <Wavy position="absolute" top={0} left={0} right={0} bottom={0} />
        <TitleText textAlign="left" size="sm">
          The Orbit Blog
        </TitleText>
      </Col>
    </Link>
  </>
)
