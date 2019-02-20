import * as React from 'react'
import { Block } from '@mcro/ui'

export const Readability = ({ children }) => {
  return <Block className="website-body" dangerouslySetInnerHTML={{ __html: children }} />
}
