import { BorderRight, Col, Divider, Image, ListItemSimple, PassProps, Space, TextProps, Theme, Title, View } from '@o/ui'
import { Inline, Row } from 'gloss'
import { mount, route } from 'navi'
import React from 'react'

import confettiImage from '../../public/images/confetti.jpg'
import { scrollTo } from '../etc/helpers'
import { useScreenSize } from '../hooks/useScreenSize'
import { Header } from '../Layout'
import { linkProps } from '../LinkState'
import { FadeChild, useFadePage } from '../views/FadeIn'
import { SectionContent } from '../views/SectionContent'
import { BlogFooter } from './BlogPage/BlogLayout'
import { useScreenVal } from './HomePage/SpacedPageContent'
import { useStickySidebar } from './useStickySidebar'

export default mount({
  '/': route({
    title: 'About',
    view: <AboutPage />,
  }),
})

export function AboutPage() {
  const screen = useScreenSize()

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
        <Header noBorder background="transparent" slim />
        <main className="main-contents" ref={Fade.ref} style={{ minHeight: 2000 }}>
          <SectionContent paddingTop={60}>
            <Image margin="auto" height={714 * 0.4} width={894 * 0.4} src={confettiImage} />
          </SectionContent>

          <SectionContent flex={1} paddingTop="5%" paddingBottom="5%">
            <Row id="main" alignItems="flex-start">
              <Col
                id="sidebar"
                width={200}
                pointerEvents="auto"
                {...screen === 'small' && { width: 0, opacity: 0 }}
              >
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
                  pad={[0, useScreenVal('sm', 'xxl', 100)]}
                  space="xxl"
                  spaceAround
                  flex={1}
                  overflow="hidden"
                  className="content"
                >
                  <BigTitle size={2.5}>
                    Making it easy to build beautiful apps that work for the user first.
                  </BigTitle>

                  <BigParagraph>
                    Developers spend too much time re-inventing the wheel, and not enough time
                    building higher level, richer and more powerful platforms.
                  </BigParagraph>

                  <BigParagraph>
                    Developers spend too much time re-inventing the wheel, and not enough time
                    building higher level, richer and more powerful platforms.
                  </BigParagraph>

                  <BigParagraph>
                    Developers spend too much time re-inventing the wheel, and not enough time
                    building higher level, richer and more powerful platforms.
                  </BigParagraph>

                  <Space size="xxxl" />
                  <Divider />
                  <Space size="xxxl" />

                  <Col space="xxxl" id="team">
                    <BigTitle>Passionate about making it easy to build creatively.</BigTitle>

                    <BigParagraph>
                      Our team is all over the world. We're always looking for great developers who
                      are passionate about making development easier, and who are driven by creating
                      high quality products.
                    </BigParagraph>

                    <BigParagraph>
                      <Inline {...linkProps('mailto:hi@tryorbit.com')}>Get in touch</Inline>.
                    </BigParagraph>
                  </Col>

                  <Space size="xxxl" />
                  <Divider />
                  <Space size="xxxl" />

                  <Col space="xxxl" id="contact">
                    <BigTitle>Get in touch</BigTitle>

                    <BigParagraph>
                      <Inline {...linkProps('mailto:hi@tryorbit.com')}>Email</Inline>
                    </BigParagraph>

                    <BigParagraph>
                      <Inline {...linkProps('https://twitter.com/tryorbit')}>Twitter</Inline>
                    </BigParagraph>

                    <BigParagraph>
                      <Inline {...linkProps('https://github.com/natew')}>Github</Inline>
                    </BigParagraph>
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

const BigParagraph = (props: TextProps) => (
  <Title selectable size={1.1} alpha={0.6} fontWeight={100} sizeLineHeight={1.35} {...props} />
)

const BigTitle = (props: TextProps) => <Title selectable size={2.25} fontWeight={100} {...props} />

AboutPage.theme = 'dark'
