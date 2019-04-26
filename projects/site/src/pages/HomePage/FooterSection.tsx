import { Button, ButtonProps, Col, Icon, Image, Row, Space, TextProps, Theme, useTheme, View } from '@o/ui'
import React from 'react'

import { Link, LinkProps } from '../../views/Header'
import { LogoVertical } from '../../views/LogoVertical'
import { Page } from '../../views/Page'
import { Text } from '../../views/Text'
import { SignupForm } from './EarlyAccessBetaSection'
import { useScreenVal } from './SpacedPageContent'

export function FeetSection(props) {
  return (
    <Theme name="home">
      <Page {...props}>
        <Page.Content pad="xxl" justifyContent="space-between">
          <Space size="xl" />
          <AboveFooter />
          <View flex={1} />
          <Footer />
        </Page.Content>

        <Page.Background
          speed={0.1}
          zIndex={-10}
          bottom="-110%"
          backgroundSize="cover"
          left="-40%"
          right="-40%"
          width="180%"
          top="-50%"
          backgroundPosition="top center"
          opacity={1}
          backgroundImage={blackWavePattern}
        />
      </Page>
    </Theme>
  )
}

export const blackWavePattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg %3E%3Cpath fill='%231f1f1f' d='M486 705.8c-109.3-21.8-223.4-32.2-335.3-19.4C99.5 692.1 49 703 0 719.8V800h843.8c-115.9-33.2-230.8-68.1-347.6-92.2C492.8 707.1 489.4 706.5 486 705.8z'/%3E%3Cpath fill='%231b1b1b' d='M1600 0H0v719.8c49-16.8 99.5-27.8 150.7-33.5c111.9-12.7 226-2.4 335.3 19.4c3.4 0.7 6.8 1.4 10.2 2c116.8 24 231.7 59 347.6 92.2H1600V0z'/%3E%3Cpath fill='%23181818' d='M478.4 581c3.2 0.8 6.4 1.7 9.5 2.5c196.2 52.5 388.7 133.5 593.5 176.6c174.2 36.6 349.5 29.2 518.6-10.2V0H0v574.9c52.3-17.6 106.5-27.7 161.1-30.9C268.4 537.4 375.7 554.2 478.4 581z'/%3E%3Cpath fill='%23151515' d='M0 0v429.4c55.6-18.4 113.5-27.3 171.4-27.7c102.8-0.8 203.2 22.7 299.3 54.5c3 1 5.9 2 8.9 3c183.6 62 365.7 146.1 562.4 192.1c186.7 43.7 376.3 34.4 557.9-12.6V0H0z'/%3E%3Cpath fill='%23111111' d='M181.8 259.4c98.2 6 191.9 35.2 281.3 72.1c2.8 1.1 5.5 2.3 8.3 3.4c171 71.6 342.7 158.5 531.3 207.7c198.8 51.8 403.4 40.8 597.3-14.8V0H0v283.2C59 263.6 120.6 255.7 181.8 259.4z'/%3E%3Cpath fill='%230e0e0e' d='M1600 0H0v136.3c62.3-20.9 127.7-27.5 192.2-19.2c93.6 12.1 180.5 47.7 263.3 89.6c2.6 1.3 5.1 2.6 7.7 3.9c158.4 81.1 319.7 170.9 500.3 223.2c210.5 61 430.8 49 636.6-16.6V0z'/%3E%3Cpath fill='%23000000' d='M454.9 86.3C600.7 177 751.6 269.3 924.1 325c208.6 67.4 431.3 60.8 637.9-5.3c12.8-4.1 25.4-8.4 38.1-12.9V0H288.1c56 21.3 108.7 50.6 159.7 82C450.2 83.4 452.5 84.9 454.9 86.3z'/%3E%3Cpath fill='%23000000' d='M1600 0H498c118.1 85.8 243.5 164.5 386.8 216.2c191.8 69.2 400 74.7 595 21.1c40.8-11.2 81.1-25.2 120.3-41.7V0z'/%3E%3Cpath fill='%23000000' d='M1397.5 154.8c47.2-10.6 93.6-25.3 138.6-43.8c21.7-8.9 43-18.8 63.9-29.5V0H643.4c62.9 41.7 129.7 78.2 202.1 107.4C1020.4 178.1 1214.2 196.1 1397.5 154.8z'/%3E%3Cpath fill='%23000000' d='M1315.3 72.4c75.3-12.6 148.9-37.1 216.8-72.4h-723C966.8 71 1144.7 101 1315.3 72.4z'/%3E%3C/g%3E%3C/svg%3E")`

export const AboveFooter = () => {
  const theme = useTheme()
  return (
    <>
      <SignupForm width="80%" background={theme.backgroundStrong} borderRadius={20} />
      <View flex={useScreenVal(1, 3, 4)} />
      <Space size={75} />
      <LogoVertical />
    </>
  )
}

export const Footer = () => {
  const sectionMinWidth = useScreenVal(250, 150, 150)
  return (
    <Row
      flexDirection={useScreenVal('column', 'row', 'row')}
      flexWrap="wrap"
      flex={8}
      space="lg"
      pad
      alignItems="flex-end"
      scrollable="y"
    >
      <Col minWidth={sectionMinWidth} flex={1} space="sm">
        <SmallTitle alt="lightRed">Orbit</SmallTitle>
        <SmallLink href="/">Home</SmallLink>
        <SmallLink href="/beta">Download</SmallLink>
        <SmallLink href="/start">Getting Started</SmallLink>
        <SmallLink href="/apps">Apps</SmallLink>
        <SmallLink href="/docs">Documentation</SmallLink>
        <SmallLink href="/about">Team</SmallLink>
        <SmallLink href="/beta">Beta</SmallLink>
      </Col>

      <Col minWidth={sectionMinWidth} flex={1} space="sm">
        <SmallTitle>Support & Terms</SmallTitle>
        <SmallLink href="mailto:hi@tryorbit.com">Contact us</SmallLink>
        <SmallLink href="/privacy">Privacy Policy</SmallLink>
        <SmallLink href="/terms">Terms & Conditions</SmallLink>
        <SmallLink href="/faq">FAQ</SmallLink>
      </Col>

      <Col minWidth={sectionMinWidth} flex={1} space="sm">
        <SmallTitle>Community</SmallTitle>
        <SmallLink href="/about">About</SmallLink>
        <SmallLink href="/blog">Blog</SmallLink>
        <SmallLink href="mailto:hi@tryorbit.com">Contact</SmallLink>
        <SmallLink href="https://twitter.com/tryorbit">Twitter</SmallLink>
        <SmallLink href="https://github.com/tryorbit">Github</SmallLink>
      </Col>

      <Col order={useScreenVal(-1, 5, 5)} minWidth={200} flex={2} space="sm">
        <SmallTitle>Follow Orbit for more updates</SmallTitle>
        <Space size="xs" />
        <Row space>
          <BottomButton href="https://github.com/tryorbit">
            <GithubIcon />
          </BottomButton>
          <BottomButton
            src={require('../../../public/logos/twitter.svg')}
            href="https://twitter.com/tryorbit"
          />
          <BottomButton>
            <Icon size={16} name="feed" />
          </BottomButton>
        </Row>
        <Space size="lg" />
      </Col>
    </Row>
  )
}

const GithubIcon = () => (
  <svg width="20px" height="20px" viewBox="0 0 438.549 438.549">
    <g fill="currentColor">
      <path
        d="M409.132,114.573c-19.608-33.596-46.205-60.194-79.798-79.8C295.736,15.166,259.057,5.365,219.271,5.365
      c-39.781,0-76.472,9.804-110.063,29.408c-33.596,19.605-60.192,46.204-79.8,79.8C9.803,148.168,0,184.854,0,224.63
      c0,47.78,13.94,90.745,41.827,128.906c27.884,38.164,63.906,64.572,108.063,79.227c5.14,0.954,8.945,0.283,11.419-1.996
      c2.475-2.282,3.711-5.14,3.711-8.562c0-0.571-0.049-5.708-0.144-15.417c-0.098-9.709-0.144-18.179-0.144-25.406l-6.567,1.136
      c-4.187,0.767-9.469,1.092-15.846,1c-6.374-0.089-12.991-0.757-19.842-1.999c-6.854-1.231-13.229-4.086-19.13-8.559
      c-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559
      c-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-0.951-2.568-2.098-3.711-3.429c-1.142-1.331-1.997-2.663-2.568-3.997
      c-0.572-1.335-0.098-2.43,1.427-3.289c1.525-0.859,4.281-1.276,8.28-1.276l5.708,0.853c3.807,0.763,8.516,3.042,14.133,6.851
      c5.614,3.806,10.229,8.754,13.846,14.842c4.38,7.806,9.657,13.754,15.846,17.847c6.184,4.093,12.419,6.136,18.699,6.136
      c6.28,0,11.704-0.476,16.274-1.423c4.565-0.952,8.848-2.383,12.847-4.285c1.713-12.758,6.377-22.559,13.988-29.41
      c-10.848-1.14-20.601-2.857-29.264-5.14c-8.658-2.286-17.605-5.996-26.835-11.14c-9.235-5.137-16.896-11.516-22.985-19.126
      c-6.09-7.614-11.088-17.61-14.987-29.979c-3.901-12.374-5.852-26.648-5.852-42.826c0-23.035,7.52-42.637,22.557-58.817
      c-7.044-17.318-6.379-36.732,1.997-58.24c5.52-1.715,13.706-0.428,24.554,3.853c10.85,4.283,18.794,7.952,23.84,10.994
      c5.046,3.041,9.089,5.618,12.135,7.708c17.705-4.947,35.976-7.421,54.818-7.421s37.117,2.474,54.823,7.421l10.849-6.849
      c7.419-4.57,16.18-8.758,26.262-12.565c10.088-3.805,17.802-4.853,23.134-3.138c8.562,21.509,9.325,40.922,2.279,58.24
      c15.036,16.18,22.559,35.787,22.559,58.817c0,16.178-1.958,30.497-5.853,42.966c-3.9,12.471-8.941,22.457-15.125,29.979
      c-6.191,7.521-13.901,13.85-23.131,18.986c-9.232,5.14-18.182,8.85-26.84,11.136c-8.662,2.286-18.415,4.004-29.263,5.146
      c9.894,8.562,14.842,22.077,14.842,40.539v60.237c0,3.422,1.19,6.279,3.572,8.562c2.379,2.279,6.136,2.95,11.276,1.995
      c44.163-14.653,80.185-41.062,108.068-79.226c27.88-38.161,41.825-81.126,41.825-128.906
      C438.536,184.851,428.728,148.168,409.132,114.573z"
      />
    </g>
  </svg>
)

const BottomButton = ({ src, href, ...props }: ButtonProps & { src?: string; href?: any }) => {
  const theme = useTheme()
  return (
    <Button
      color={theme.color}
      alt="clear"
      elementProps={{
        href,
        tagName: 'a',
        target: '_blank',
      }}
      userSelect="none"
      circular
      size={2}
      cursor="pointer"
      {...props}
    >
      {(!!src && <Image width={25} height={25} src={src} />) || props.children}
    </Button>
  )
}

const SmallTitle = (props: TextProps) => <Text fontSize={14} textTransform="uppercase" {...props} />

export const SmallLink = (props: Partial<LinkProps>) => (
  <Link width="100%" textAlign="left" fontWeight={500} fontSize={15} href="" {...props} />
)
