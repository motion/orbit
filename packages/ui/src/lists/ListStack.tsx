import React from 'react'
import { Stack } from '../Stack'

type ListStackProps = {
  lists?: React.ReactNode[]
}

export function ListStack(props: ListStackProps) {
  return <Stack items={props.lists} />
}
