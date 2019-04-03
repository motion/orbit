import { AppProps } from '@o/kit'
import { Card, MasonryLayout, useFetch } from '@o/ui'
import React from 'react'

export function CustomAppMain(_props: AppProps) {
  const items = useFetch('https://jsonplaceholder.typicode.com/photos')
  _props
  return (
    <MasonryLayout padded>
      {items.slice(0, 10).map(item => (
        <div key={item.id} style={{ width: 200, height: 300 }}>
          <Card flex={1} overflow="hidden" title={item.title}>
            <img src={item.url} />
          </Card>
        </div>
      ))}
    </MasonryLayout>
  )
}
