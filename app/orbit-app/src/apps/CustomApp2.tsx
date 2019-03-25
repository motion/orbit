import { App, AppProps, createApp } from '@o/kit'
import { GridItem, GridLayout, Title } from '@o/ui'
import React from 'react'

function CustomApp2(_props: AppProps) {
  return (
    <App>
      <Title>hi 2 2</Title>

      <GridLayout>
        <GridItem>hello 1234</GridItem>
      </GridLayout>
    </App>
  )
}

export default createApp({
  id: 'custom2',
  name: 'Custom App 2',
  icon: '',
  app: CustomApp2,
})
