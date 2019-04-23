import { Absolute, Col, Space } from '@o/ui'
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
import { purpleWave, Wavy } from './HomePage/EarlyAccessBetaSection'

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
      <Header slim noBorder />
      {props.children}
    </MDX>
  )
}

BlogPage.theme = 'light'

function PostPage(props: { post: PostEntry; children?: any }) {
  return (
    <>
      <BlogTitle />
      <SectionContent>
        <Col pad="xxxl" maxWidth={800} margin="auto" fontSize={20} lineHeight={32}>
          <TitleText color={purpleWave.backgroundColor} size="xxl">
            {props.post.title}
          </TitleText>
          <Space />
          {props.children}
        </Col>
      </SectionContent>
      <BlogFooter />
    </>
  )
}

export const BlogTitle = () => (
  <Col position="relative">
    <SectionContent>
      <Link href="/blog" style={{ textDecoration: 'none', cursor: 'pointer' }}>
        <Col padding={[100, 30, 50]} position="relative" cursor="pointer">
          <TitleText selectable={false} textAlign="left" size="xxl" fontWeight={200}>
            The Orbit Blog
          </TitleText>
        </Col>
      </Link>

      <Absolute bottom={0} left={0} right={0} height={10}>
        <Wavy position="absolute" top={0} left={0} right={0} bottom={0} />
      </Absolute>
    </SectionContent>
  </Col>
)
