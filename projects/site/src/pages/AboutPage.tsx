import { Inline, Row } from '@o/gloss'
import { BorderRight, Col, Divider, ListItemSimple, PassProps, Space, Theme, Title, View } from '@o/ui'
import { mount, route } from 'navi'
import React from 'react'

import { scrollTo } from '../etc/helpers'
import { FadeChild, useFadePage } from '../views/FadeIn'
import { Header } from '../views/Header'
import { SectionContent } from '../views/SectionContent'
import { BlogFooter } from './BlogPage/BlogLayout'
import { linkProps } from './HomePage/linkProps'
import { useStickySidebar } from './useStickySidebar'

export default mount({
  '/': route({
    title: 'About',
    view: <AboutPage />,
  }),
})

export function AboutPage() {
  const Fade = useFadePage({
    threshold: 0,
  })

  useStickySidebar({
    id: '#sidebar',
    containerSelector: '#main',
  })

  return (
    <Fade.FadeProvide>
      <Theme name={AboutPage.theme}>
        <main ref={Fade.ref} style={{ minHeight: 2000 }}>
          <Header position="absolute" left={0} right={0} background="transparent" slim />

          <SectionContent flex={1} marginTop={54} paddingTop="5%" paddingBottom="5%">
            <Row id="main" alignItems="flex-start">
              <Col id="sidebar" width={200} pointerEvents="auto">
                <Col position="relative" className="sidebar__inner" flex={1}>
                  <FadeChild delay={200}>
                    <Space size={35} />
                    <PassProps
                      titleProps={{ fontSize: 18, padding: [10, 20], textAlign: 'right' }}
                      fontFamily="GT Eesti"
                    >
                      <ListItemSimple
                        onClick={() => {
                          scrollTo('#mission')
                        }}
                        title="Mission"
                      />
                      <ListItemSimple
                        onClick={() => {
                          scrollTo('#team')
                        }}
                        title="Team"
                      />
                      <ListItemSimple
                        onClick={() => {
                          scrollTo('#jobs')
                        }}
                        title="Jobs"
                      />
                      <ListItemSimple
                        onClick={() => {
                          scrollTo('#contact')
                        }}
                        title="Contact"
                      />
                    </PassProps>
                    <BorderRight top={10} opacity={0.5} />
                  </FadeChild>
                </Col>
              </Col>
              <FadeChild delay={400} style={{ flex: 1 }}>
                <Col
                  id="mission"
                  padding={[0, 90]}
                  space="xxl"
                  spaceAround
                  flex={1}
                  overflow="hidden"
                  className="content"
                >
                  <Title selectable size={4} fontWeight={100}>
                    Making it easy to build beautiful apps that work for the user first.
                  </Title>

                  <Title selectable size={1.5} alpha={0.6} fontWeight={100} sizeLineHeight={1.5}>
                    Developers spend too much time re-inventing the wheel, and not enough time
                    building higher level, richer and more powerful platforms.
                  </Title>

                  <Title selectable size={1.5} alpha={0.6} fontWeight={100} sizeLineHeight={1.5}>
                    Developers spend too much time re-inventing the wheel, and not enough time
                    building higher level, richer and more powerful platforms.
                  </Title>

                  <Title selectable size={1.5} alpha={0.6} fontWeight={100} sizeLineHeight={1.5}>
                    Developers spend too much time re-inventing the wheel, and not enough time
                    building higher level, richer and more powerful platforms.
                  </Title>

                  <Space size="xxxl" />
                  <Divider />
                  <Space size="xxxl" />

                  <Col space="xxxl" id="team">
                    <Title selectable size={4} fontWeight={100}>
                      Passionate about making it easy to build creatively.
                    </Title>

                    <Title selectable size={1.5} alpha={0.6} fontWeight={100} sizeLineHeight={1.5}>
                      Our team is all over the world. We're always looking for great developers who
                      are passionate about making development easier, and who are driven by creating
                      high quality products.
                    </Title>

                    <Title selectable size={1.5} alpha={0.6} fontWeight={100} sizeLineHeight={1.5}>
                      <Inline {...linkProps('mailto:hi@tryorbit.com')}>Get in touch</Inline>.
                    </Title>
                  </Col>

                  <Space size="xxxl" />
                  <Divider />
                  <Space size="xxxl" />

                  <Col space="xxxl" id="contact">
                    <Title selectable size={4} fontWeight={100}>
                      Get in touch
                    </Title>

                    <Title selectable size={1.5} alpha={0.6} fontWeight={100} sizeLineHeight={1.5}>
                      <Inline {...linkProps('mailto:hi@tryorbit.com')}>Email</Inline>
                    </Title>

                    <Title selectable size={1.5} alpha={0.6} fontWeight={100} sizeLineHeight={1.5}>
                      <Inline {...linkProps('https://twitter.com/tryorbit')}>Twitter</Inline>
                    </Title>

                    <Title selectable size={1.5} alpha={0.6} fontWeight={100} sizeLineHeight={1.5}>
                      <Inline {...linkProps('https://github.com/natew')}>Github</Inline>
                    </Title>
                  </Col>
                </Col>
              </FadeChild>
            </Row>
          </SectionContent>

          <View flex={1} />

          <BlogFooter />
        </main>
      </Theme>
    </Fade.FadeProvide>
  )
}

AboutPage.theme = 'dark'
