import React from 'react'
import { Stack } from '../Stack'

type ListStackProps = {
  children?: React.ReactNode[]
}

export function ListStack(props: ListStackProps) {
  return <Stack items={props.children} />
}
