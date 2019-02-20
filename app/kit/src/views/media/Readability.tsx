import { Block } from '@mcro/ui'
import * as React from 'react'

export const Readability = ({ children }) => {
  return <Block className="website-body" dangerouslySetInnerHTML={{ __html: children }} />
}
