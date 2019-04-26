import { Button, ListItem, Popover } from '@o/ui'
import React from 'react'

export let Basic = (
  <Popover
    group="demo"
    open
    towards="bottom"
    elevation={2}
    width={300}
    target={
      <Button alt="action" size="lg" marginBottom={100}>
        Hover me
      </Button>
    }
  >
    <ListItem icon="home">Home</ListItem>
    <ListItem icon="home">Home</ListItem>
    <ListItem icon="home">Home</ListItem>
  </Popover>
)

export let Hover = (
  <Popover
    openOnHover
    target={
      <Button alt="action" size="lg">
        Hover me
      </Button>
    }
  >
    <ListItem icon="home">Home</ListItem>
    <ListItem icon="home">Home</ListItem>
    <ListItem icon="home">Home</ListItem>
  </Popover>
)
