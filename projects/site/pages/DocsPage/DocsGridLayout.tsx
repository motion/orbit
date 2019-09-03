import { Button, Card, GridItem, GridLayout, Row, useBoundedNumberState, useFetch } from '@o/ui'
import React from 'react'

export let Basic = () => {
  const items = useFetch('https://jsonplaceholder.typicode.com/photos')
  const [num, setNum] = useBoundedNumberState(2, 1, 5)
  return (
    <>
      <Row group>
        <Button flex={1} onClick={() => setNum(num - 1)}>
          Less
        </Button>
        <Button flex={1} onClick={() => setNum(num + 1)}>
          More
        </Button>
      </Row>
      <GridLayout height={600} key={num}>
        {items.slice(0, num).map((item, index) => (
          <GridItem key={item.id} id={item.id} w={index === 0 ? 4 : 2} h={index === 0 ? 4 : 2}>
            <Card flex={1} overflow="hidden" title={item.title} elevation={5}>
              <img src={item.url} />
            </Card>
          </GridItem>
        ))}
      </GridLayout>
    </>
  )
}
