import * as React from 'react'
import { view } from '@mcro/black'
import { PeekBitResolver } from '../index'

const BodyContents = view({
  whiteSpace: 'pre-line',
  padding: 20,
  fontSize: 16,
  lineHeight: '1.5rem',
  overflow: 'hidden',
})

export const Task = ({ bit, appStore, children }) => {
  if (!bit) {
    return children({})
  }
  return (
    <PeekBitResolver appStore={appStore} bit={bit}>
      {({ title, location, content, comments, icon, permalink }) => {
        return children({
          title,
          subtitle: location,
          icon,
          permalink,
          content: (
            <>
              <BodyContents
                className="markdown"
                dangerouslySetInnerHTML={{
                  __html: content,
                }}
              />
              <BodyContents>{comments}</BodyContents>
              <br />
              <br />
            </>
          ),
        })
      }}
    </PeekBitResolver>
  )
}
