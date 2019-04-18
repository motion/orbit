import React from 'react'
import { SectionContent } from '../../views/SectionContent'

export function BlogLayout(props: { children?: any }) {
  return <SectionContent>{props.children}</SectionContent>
}
