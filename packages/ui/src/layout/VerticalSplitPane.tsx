import React from 'react'
import { Interactive, InteractiveProps } from '../Interactive'

export function VerticalSplitPane(props: Partial<InteractiveProps>) {
  // !TODO make this measure parentNode on mount and then get 50% of that width and pass it in as default
  // also make it resizable properly
  return <Interactive width={400} minWidth={200} maxWidth={600} {...props} />
}
