import React from 'react'
import { Parallax } from 'react-spring/renderprops-addons'
import { HeadSection } from './HomePage/HeadSection'

export function HomePage() {
  return (
    <Parallax pages={3}>
      <HeadSection />
    </Parallax>
  )
}

HomePage.path = ''
HomePage.navigationOptions = {
  title: 'Home',
  linkName: 'Home Page',
}
