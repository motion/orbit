import { Grid, Space, Stack, StackProps, TitleRow } from '@o/ui'
import { compose, mount, route, withView } from 'navi'
import React from 'react'
import { View } from 'react-navi'

import { Header } from '../Header'
import { linkProps } from '../useLink'
import { ContentSection } from '../views/ContentSection'
import { FadeInView, FadeParent } from '../views/FadeInView'
import { H3 } from '../views/H1'
import { MDX } from '../views/MDX'
import { SectionContent } from '../views/SectionContent'
import { TitleText } from '../views/TitleText'
import { DocsFeatureCard } from './DocsPage/DocsFeatureCard'
import { guideCategories, GuideEntry, guides } from './GuidesPage/guides'
import { AboveFooter } from './HomePage/AboveFooter'
import { Footer } from './HomePage/Footer'

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

GuidesPage.theme = 'dark'

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
    <>
      <GuidesLayout title="Guides">
        {Object.keys(guideCategories).map(key => {
          return (
            <Stack key={key}>
              <H3>{guideCategories[key]}</H3>
              <Grid space itemMinWidth={170}>
                {all
                  .filter(x => x.categories.includes(key as any))
                  .map((post, index) => (
                    <FadeInView key={post.date} delay={index * 150}>
                      <DocsFeatureCard
                        icon={post.icon}
                        background={post.color}
                        color="white"
                        title={post.title}
                        {...linkProps(`/guides/${all[index].id}`)}
                      />
                    </FadeInView>
                  ))}
              </Grid>
            </Stack>
          )
        })}
      </GuidesLayout>
    </>
  )
}

export function GuidesLayout({ children, title, ...props }: StackProps & { title: string }) {
  return (
    <>
      <SectionContent minHeight={500} padding="xxl">
        <TitleRow size="lg" title={title} bordered padding />
        <Space size="xl" />
        <Stack space="xl">{children}</Stack>
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
      <Stack height={450} padding={[true, 0]}>
        <AboveFooter />
      </Stack>
      <Space size="xxl" />
      <SectionContent padding={[50, 0]}>
        <Footer />
      </SectionContent>
    </>
  )
}
