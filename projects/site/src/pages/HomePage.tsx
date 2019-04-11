import { Theme } from '@o/ui'
import React from 'react'
import { Parallax } from 'react-spring/renderprops-addons'
import { HeadSection } from './HomePage/HeadSection'

export function HomePage() {
  return (
    <Theme name="home">
      <Parallax pages={3}>
        <HeadSection />
      </Parallax>
    </Theme>
  )
}

HomePage.path = ''
HomePage.navigationOptions = {
  title: 'Home',
  linkName: 'Home Page',
}
