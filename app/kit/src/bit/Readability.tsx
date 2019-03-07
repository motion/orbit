import { Block } from '@o/ui'
import * as React from 'react'

export function Readability({ children }) {
  return <Block className="website-body" dangerouslySetInnerHTML={{ __html: children }} />
}
