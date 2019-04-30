import { CardProps, Col, Grid, Icon, TiltCard } from '@o/ui'
import React from 'react'

import { themes } from '../../themes'

const examples = [
  { title: 'Building an App', subTitle: 'Something', colors: themes.lightOrange, icon: 'home' },
  { title: 'Templates', colors: themes.lightBlue, icon: 'layout' },
  { title: 'Flows', colors: themes.lightGreen, icon: 'i' },
]

const FeatureCard = (props: CardProps) => (
  <TiltCard
    size="xl"
    titleProps={{ size: 'xs' }}
    titlePad="md"
    subTitleProps={{
      size: 'xxs',
    }}
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
          height={200}
          background={example.colors.background}
          alignItems="center"
          justifyContent="center"
          pad
          flex={1}
        >
          <Icon color={example.colors.color} size={80} name={example.icon} />
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
          height={200}
          background={example.colors.background}
          alignItems="center"
          justifyContent="center"
          pad
        >
          <Icon color={example.colors.color} size={80} name={example.icon} />
        </Col>
      </FeatureCard>
    ))}
  </Grid>
)
