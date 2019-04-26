import { Row } from '@o/gloss'
import { BorderRight, Col, Divider, ListItemSimple, PassProps, Space, Theme, Title, View } from '@o/ui'
import { mount, route } from 'navi'
import React from 'react'

import { FadeChild, useFadePage } from '../views/FadeIn'
import { Header } from '../views/Header'
import { PillButton } from '../views/PillButton'
import { SectionContent } from '../views/SectionContent'
import { BlogFooter } from './BlogPage/BlogLayout'
import { useStickySidebar } from './DocsPage'

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
            <Row id="main">
              <FadeChild delay={200}>
                <Col id="sidebar" width={200} pointerEvents="auto">
                  <Col position="relative" className="sidebar__inner" flex={1}>
                    <Space size={35} />
                    <PassProps
                      titleProps={{ fontSize: 18, padding: [10, 20], textAlign: 'right' }}
                      fontFamily="GT Eesti"
                    >
                      <ListItemSimple title="Mission" />
                      <ListItemSimple title="Team" />
                      <ListItemSimple title="Jobs" />
                      <ListItemSimple title="Contact" />
                    </PassProps>
                    <BorderRight top={10} opacity={0.5} />
                  </Col>
                </Col>
              </FadeChild>
              <FadeChild delay={400} style={{ flex: 1 }}>
                <Col
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
                    <PillButton>Team</PillButton>
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
                  </Col>

                  <Space size="xxxl" />
                  <Divider />
                  <Space size="xxxl" />

                  <Col space="xxxl" id="jobs">
                    <PillButton>Jobs</PillButton>
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
                  </Col>

                  <Space size="xxxl" />
                  <Divider />
                  <Space size="xxxl" />

                  <Col space="xxxl" id="contact">
                    <PillButton>Contact</PillButton>
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
