import { Space, gloss, ColProps, Col, Grid } from '@o/ui'
import { compose, mount, route, withView } from 'navi'
import React from 'react'
import { View } from 'react-navi'

import { Header } from '../Header'
import { ContentSection } from '../views/ContentSection'
import { FadeParent, FadeChild } from '../views/FadeIn'
import { MDX } from '../views/MDX'
import { SectionContent } from '../views/SectionContent'
import { TitleText } from '../views/TitleText'
import { guides, GuideEntry } from './GuidesPage/guides'
import { AboveFooter } from './HomePage/AboveFooter'
import { Footer } from './HomePage/Footer'
import { linkProps } from '../LinkState'
import { useScreenVal } from './HomePage/SpacedPageContent'
import { colors } from '../constants'

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
      if (!guides[id]) {
        return {
          view: () => <div>not found</div>,
        }
      }
      let ChildView = (await guides[id].view()).default
      return {
        view: (
          <PostPage post={guides[id]}>
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

function PostPage(props: { post: GuideEntry; children?: any }) {
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
  const all = Object.keys(guides)
    .map(id => ({
      ...guides[id],
      id,
    }))
    .filter(x => !x.private)
    .sort((a, b) => (new Date(a.date).getTime() > new Date(b.date).getTime() ? -1 : 1))
  return (
    <GuidesLayout space>
      {all.map((post, index) => (
        <FadeChild key={post.date} delay={index * 150}>
          <Col
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
          </Col>
        </FadeChild>
      ))}
    </GuidesLayout>
  )
}

export function GuidesLayout({ children, ...props }: ColProps) {
  return (
    <>
      <SectionContent minHeight={500} padding="xxl">
        <Grid itemMaxWidth={200} itemMinWidth={150} {...props}>
          {children}
        </Grid>
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
