import { Card, GridItem, GridLayout, useFetch } from '@o/ui'
import React from 'react'

export let Basic = () => {
  const items = useFetch('https://jsonplaceholder.typicode.com/photos')
  return (
    <GridLayout>
      {items.slice(0, 10).map((item, index) => (
        <GridItem key={item.id} w={index === 0 ? 4 : 2} h={index === 0 ? 4 : 2}>
          <Card flex={1} overflow="hidden" title={item.title}>
            <img src={item.url} />
          </Card>
        </GridItem>
      ))}
    </GridLayout>
  )
}
