import { Space, gloss, ColProps, Col } from '@o/ui'
import { compose, mount, route, withView } from 'navi'
import React from 'react'
import { View } from 'react-navi'

import { Header } from '../Header'
import { ContentSection } from '../views/ContentSection'
import { FadeParent, FadeChild } from '../views/FadeIn'
import { MDX } from '../views/MDX'
import { SectionContent } from '../views/SectionContent'
import { TitleText } from '../views/TitleText'
import { posts } from './GuidesPage/guides'
import { AboveFooter } from './HomePage/AboveFooter'
import { Footer } from './HomePage/Footer'
import { linkProps } from '../LinkState'
import { useScreenVal } from './HomePage/SpacedPageContent'
import { colors } from '../constants'
import { PostEntry } from './BlogPage/PostEntry'

export default compose(
  withView(() => {
    return (
      <GuidesPage>
        <View />
      </GuidesPage>
    )
  }),

  mount({
    '/': route({
      title: 'Guides',
      view: GuidesPageIndex,
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

export function GuidesPage(props: { title?: string; children?: any }) {
  return (
    <FadeParent>
      <MDX>
        <Header slim noBorder />
        <main className="main-contents">{props.children}</main>
      </MDX>
    </FadeParent>
  )
}

GuidesPage.theme = 'light'

function PostPage(props: { post: PostEntry; children?: any }) {
  return (
    <>
      <SectionContent>
        <ContentSection>
          <TitleText size="xxl">{props.post.title}</TitleText>
          <Space />
          {props.children}
        </ContentSection>
      </SectionContent>
      <GuidesFooter />
    </>
  )
}

export function GuidesPageIndex() {
  const all = Object.keys(posts)
    .slice(0, 10)
    .map(id => ({
      ...posts[id],
      id,
    }))
    .filter(x => !x.private)
    .sort((a, b) => (new Date(a.date).getTime() > new Date(b.date).getTime() ? -1 : 1))

  return (
    <GuidesLayout space>
      {all.map((post, index) => (
        <FadeChild key={post.date} delay={index * 150}>
          <Post
            padding={useScreenVal('md', 'xl', 'xl')}
            {...linkProps(`/guides/${all[index].id}`)}
            hoverStyle={{
              background: '#f9f9f9',
            }}
          >
            <TitleText
              fontWeight={200}
              color={colors.purple}
              selectable={false}
              textAlign="left"
              size="md"
            >
              {post.title}
            </TitleText>
            <Space size="sm" />
          </Post>
        </FadeChild>
      ))}
    </GuidesLayout>
  )
}

const Post = gloss(View, {})

export function GuidesLayout({ children, ...props }: ColProps) {
  return (
    <>
      <GuidesTitle />
      <SectionContent minHeight={500}>
        <Col {...props}>{children}</Col>
      </SectionContent>
      <GuidesFooter />
    </>
  )
}

export function GuidesFooter() {
  return (
    <>
      <Space size="xxl" />
      <Space size="xxl" />
      <Space size="xxl" />
      <Col height={450} padding={[true, 0]}>
        <AboveFooter />
      </Col>
      <Space size="xxl" />
      <SectionContent padding={[50, 0]}>
        <Footer />
      </SectionContent>
    </>
  )
}
