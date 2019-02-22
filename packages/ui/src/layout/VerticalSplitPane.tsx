import React from 'react'
import { Interactive, InteractiveProps } from '../Interactive'

export default function VerticalSplitPane(props: InteractiveProps) {
  // !TODO make this measure parentNode on mount and then get 50% of that width and pass it in as default
  // also make it resizable properly
  return <Interactive width={400} {...props} />
}
