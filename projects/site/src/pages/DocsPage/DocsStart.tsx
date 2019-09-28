import { Button, Divider, Grid, Section, Space, Stack } from '@o/ui'
import React from 'react'

import { themes } from '../../themes'
import { linkProps } from '../../useLink'
import { DocsFeatureCard } from './DocsFeatureCard'

const examples = [
  { title: 'Building an App', subTitle: 'Something', colors: themes.lightOrange, icon: 'home' },
  { title: 'Templates', colors: themes.lightBlue, icon: 'layout' },
  { title: 'Flows', colors: themes.lightGreen, icon: 'i' },
]

export const LatestUpdates = () => (
  <Grid space="xl" itemMinWidth={220}>
    {examples.map(example => (
      <DocsFeatureCard
        key={example.title}
        subTitle={example.subTitle}
        title={example.title}
        background={example.colors.background}
        color={example.colors.color}
        icon={example.icon}
      />
    ))}
  </Grid>
)

export const Tutorials = () => (
  <Grid space="xl" itemMinWidth={200}>
    {examples.map(example => (
      <DocsFeatureCard
        key={example.title}
        subTitle={example.subTitle}
        title={example.title}
        background={example.colors.background}
        color={example.colors.color}
        icon={example.icon}
      />
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
      <Stack space="xl">
        <Section title="User Interface" titleSize="xxs" space titleProps={{ fontWeight: 300 }}>
          <Grid space="xl" itemMinWidth={100}>
            {interfacelinks.map(link => (
              <Button
                coat="bordered"
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
                coat="bordered"
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
      </Stack>
    </>
  )
}
