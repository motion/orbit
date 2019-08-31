import { Button, CardProps, Col, Divider, Grid, Icon, Section, Space, TiltCard } from '@o/ui'
import React from 'react'

import { linkProps } from '../../useLink'
import { themes } from '../../themes'

const examples = [
  { title: 'Building an App', subTitle: 'Something', colors: themes.lightOrange, icon: 'home' },
  { title: 'Templates', colors: themes.lightBlue, icon: 'layout' },
  { title: 'Flows', colors: themes.lightGreen, icon: 'i' },
]

const FeatureCard = (props: CardProps) => (
  <TiltCard
    size="xl"
    titlePadding="md"
    cursor="pointer"
    tagName="a"
    textDecoration="none"
    elevation={1}
    {...props}
  />
)

export const LatestUpdates = () => (
  <Grid space="xl" itemMinWidth={220}>
    {examples.map(example => (
      <FeatureCard key={example.title} subTitle={example.subTitle} title={example.title}>
        <Col
          minHeight={200}
          background={example.colors.background}
          alignItems="center"
          justifyContent="center"
          pad
          flex={1}
        >
          <Icon color={example.colors.color} size={52} name={example.icon} />
        </Col>
      </FeatureCard>
    ))}
  </Grid>
)

export const Tutorials = () => (
  <Grid space="xl" itemMinWidth={200}>
    {examples.map(example => (
      <FeatureCard key={example.title} title={example.title}>
        <Col
          height={180}
          background={example.colors.background}
          alignItems="center"
          justifyContent="center"
          pad
        >
          <Icon color={example.colors.color} size={40} name={example.icon} />
        </Col>
      </FeatureCard>
    ))}
  </Grid>
)

const interfacelinks = [
  { href: '/docs/gloss', name: 'Styling' },
  { href: '/docs/ui', name: 'UI Kit' },
  { href: '/docs/kit', name: 'App Kit' },
]

const datalinks = [
  { href: '/docs/data-app-state', name: 'App State' },
  { href: '/docs/data-user-state', name: 'User State' },
  { href: '/docs/data-sync', name: 'Syncing' },
]

export const HelpfulLinks = () => {
  return (
    <>
      <Space size="lg" />
      <Divider />
      <Space size="lg" />
      <Col space="xl">
        <Section title="User Interface" titleSize="xxs" space titleProps={{ fontWeight: 300 }}>
          <Grid space="xl" itemMinWidth={100}>
            {interfacelinks.map(link => (
              <Button
                alt="bordered"
                size={1.2}
                sizeHeight={2}
                key={link.href}
                {...linkProps(link.href)}
              >
                {link.name}
              </Button>
            ))}
          </Grid>
        </Section>

        <Section
          title="Data Management & Syncing"
          titleSize="xxs"
          space
          titleProps={{ fontWeight: 300 }}
        >
          <Grid space="xl" itemMinWidth={100}>
            {datalinks.map(link => (
              <Button
                alt="bordered"
                size={1.2}
                sizeHeight={2}
                key={link.href}
                {...linkProps(link.href)}
              >
                {link.name}
              </Button>
            ))}
          </Grid>
        </Section>
      </Col>
    </>
  )
}
