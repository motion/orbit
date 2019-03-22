import React from 'react'
import { HeadSection } from './HomePage/HeadSection'

export function HomePage() {
  return (
    <>
      <HeadSection />
    </>
  )
}

HomePage.path = ''
HomePage.navigationOptions = {
  title: 'Home',
  linkName: 'Home Page',
}
