import { Card, Col, Grid, Icon } from '@o/ui'
import React from 'react'

import { themes } from '../../themes'

const examples = [
  { title: 'Building an App', colors: themes.lightOrange, icon: 'home' },
  { title: 'Templates', colors: themes.lightBlue, icon: 'layout' },
  { title: 'Flows', colors: themes.lightGreen, icon: 'i' },
]

export const LatestUpdates = () => (
  <Grid space="xl" itemMinWidth={200}>
    {examples.map(example => (
      <Card key={example.title} size="xl" title={example.title}>
        <Col
          height={200}
          background={example.colors.background}
          alignItems="center"
          justifyContent="center"
          pad
        >
          <Icon color={example.colors.color} size={80} name={example.icon} />
        </Col>
      </Card>
    ))}
  </Grid>
)

export const Tutorials = () => (
  <Grid space="xl" itemMinWidth={200}>
    {examples.map(example => (
      <Card key={example.title} size="xl" title={example.title}>
        <Col
          height={200}
          background={example.colors.background}
          alignItems="center"
          justifyContent="center"
          pad
        >
          <Icon color={example.colors.color} size={80} name={example.icon} />
        </Col>
      </Card>
    ))}
  </Grid>
)
