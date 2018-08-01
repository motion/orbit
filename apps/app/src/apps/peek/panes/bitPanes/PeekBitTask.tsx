import * as React from 'react'
import { view, compose } from '@mcro/black'
import { PeekRelatedStore } from '../../stores/PeekRelatedStore'
// import { RelatedPeople } from '../../views/RelatedPeople'
import { PeekBitPaneProps } from './PeekBitPaneProps'

const BodyContents = view({
  whiteSpace: 'pre-line',
  padding: 20,
  fontSize: 16,
  lineHeight: 22,
  overflow: 'hidden',
})

type Props = PeekBitPaneProps & {
  relatedStore: PeekRelatedStore
}

const decorator = compose(
  view.attach({
    relatedStore: PeekRelatedStore,
  }),
)

export const Task = decorator(({ content, comments }: Props) => {
  return (
    <>
      {/* <RelatedPeople title="Assigned" relatedStore={relatedStore} /> */}
      <BodyContents
        className="markdown searchable"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
      <BodyContents>{comments}</BodyContents>
      <br />
      <br />
    </>
  )
})
