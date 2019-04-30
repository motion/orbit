import { Button, ListItem, Popover } from '@o/ui'
import React from 'react'

export let Basic = (
  <Popover
    group="demo"
    openOnClick
    towards="bottom"
    elevation={8}
    width={300}
    target={
      <Button alt="action" size="lg">
        Open on Click
      </Button>
    }
  >
    <ListItem icon="home">Home</ListItem>
    <ListItem icon="home">Home</ListItem>
    <ListItem icon="home">Home</ListItem>
  </Popover>
)

export let Themed = (
  <Popover
    group="demo"
    openOnClick
    towards="bottom"
    elevation={8}
    width={300}
    popoverTheme="tooltip"
    target={
      <Button alt="action" size="lg">
        Open on Click
      </Button>
    }
  >
    <ListItem icon="home">Home</ListItem>
    <ListItem icon="home">Home</ListItem>
    <ListItem icon="home">Home</ListItem>
  </Popover>
)
