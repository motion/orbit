import { AppProps } from '@o/kit'
import { Card, GridItem, GridLayout, useFetch } from '@o/ui'
import React from 'react'

export function CustomAppMain(_props: AppProps) {
  const items = useFetch('https://jsonplaceholder.typicode.com/photos')
  _props
  return (
    <GridLayout>
      {items.slice(0, 10).map(item => (
        <GridItem key={item.id}>
          <Card flex={1} overflow="hidden" title={item.title}>
            <img src={item.url} />
          </Card>
        </GridItem>
      ))}
    </GridLayout>
  )
}
