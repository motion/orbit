import { Absolute, Col, Space } from '@o/ui'
import { compose, mount, route, withView } from 'navi'
import React from 'react'
import { Link, View } from 'react-navi'

import { ContentSection } from '../views/ContentSection'
import { Header } from '../views/Header'
import { MDX } from '../views/MDX'
import { SectionContent } from '../views/SectionContent'
import { TitleText } from '../views/TitleText'
import { BlogFooter } from './BlogPage/BlogLayout'
import { BlogPageIndex, PostMeta } from './BlogPage/BlogPageIndex'
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
      <Header slim noBorder />
      {props.children}
    </MDX>
  )
}

BlogPage.theme = 'light'

function PostPage(props: { post: PostEntry; children?: any }) {
  return (
    <>
      <BlogTitle paddingTop={50} />
      <SectionContent>
        <ContentSection>
          <TitleText size="xxxl">{props.post.title}</TitleText>
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

export const BlogTitle = (props: any) => (
  <Col position="relative">
    <SectionContent>
      <Link href="/blog" style={{ textDecoration: 'none', cursor: 'pointer' }}>
        <Col padding={[100, 30, 50]} position="relative" cursor="pointer" {...props}>
          <TitleText
            cursor="pointer"
            textAlign="left"
            size="lg"
            fontWeight={200}
            alpha={0.5}
            hoverStyle={{ alpha: 1 }}
          >
            The Orbit Blog
          </TitleText>
        </Col>
      </Link>

      <Absolute bottom={0} left={0} right={0} height={5}>
        <Wavy position="absolute" top={0} left={0} right={0} bottom={0} />
      </Absolute>
    </SectionContent>
  </Col>
)
