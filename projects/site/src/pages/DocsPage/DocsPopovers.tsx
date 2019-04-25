import { Button, ListItem, Popover } from '@o/ui'
import React from 'react'

export let Basic = (
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

export let WithLists = (
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
